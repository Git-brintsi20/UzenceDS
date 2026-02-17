import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Represents a single item the virtualizer tells the renderer to mount.
 *
 * `index`  — position in the full data array (0 … itemCount-1).
 * `offsetTop` — pixel distance from the top of the virtual scroll content.
 *
 * The renderer uses `offsetTop` to absolutely-position each row inside
 * the scroll container so it lands in the right visual spot.
 */
export interface VirtualItem {
  index: number;
  offsetTop: number;
}

/**
 * Configuration accepted by useVirtualizer.
 *
 * `containerRef` — the scrollable DOM element we attach the scroll listener to.
 * `itemCount`    — total number of rows in the dataset (can be 10k+).
 * `itemHeight`   — fixed height of every row in pixels.
 * `overscan`     — extra rows rendered above & below the viewport to avoid
 *                  flicker when scrolling fast. Defaults to 5.
 */
export interface VirtualizerOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemCount: number;
  itemHeight: number;
  overscan?: number;
}

/**
 * useVirtualizer — custom hook that renders only the visible slice of a list.
 *
 * ═══════════════════════════════════════════════════════════════════
 * THE MATH (so you can explain it in an interview)
 * ═══════════════════════════════════════════════════════════════════
 *
 * Given:
 *   H   = container viewport height in pixels (measured from the DOM)
 *   h   = fixed row height in pixels (e.g. 32)
 *   S   = current scrollTop in pixels (how far the user has scrolled)
 *   N   = total item count
 *   O   = overscan row count (buffer above + below the viewport)
 *
 * Step 1 — Total scrollable height:
 *   totalHeight = N × h
 *   This is applied to an inner "spacer" div so the scrollbar thumb
 *   reflects the real data size, even though we only mount a handful
 *   of DOM nodes.
 *
 * Step 2 — First visible index (which row is at the top of the viewport?):
 *   rawStart = floor(S / h)
 *   The pixel offset S divided by row height gives us the row index
 *   whose top edge is at or just above the viewport's top edge.
 *
 * Step 3 — How many rows fit in the viewport?
 *   visibleCount = ceil(H / h)
 *   We use ceil because a partially-visible row still needs to be rendered.
 *
 * Step 4 — Apply overscan buffer:
 *   startIndex = max(0, rawStart − O)
 *   endIndex   = min(N − 1, rawStart + visibleCount + O)
 *   The overscan rows prevent white flashes when scrolling quickly —
 *   by the time a row scrolls into the viewport, it's already been
 *   mounted and painted by the browser.
 *
 * Step 5 — Build the virtual items array:
 *   For each i from startIndex to endIndex:
 *     offsetTop = i × h
 *   This tells the renderer where to position the row absolutely.
 *
 * ═══════════════════════════════════════════════════════════════════
 *
 * @returns virtualItems — the subset of items to actually render.
 * @returns totalHeight  — the full pixel height for the scrollbar.
 */
export function useVirtualizer({
  containerRef,
  itemCount,
  itemHeight,
  overscan = 5,
}: VirtualizerOptions): {
  virtualItems: VirtualItem[];
  totalHeight: number;
} {
  const [scrollTop, setScrollTop] = useState(0);
  // Initialize with reasonable default to avoid 0-height calculation on first render
  const [containerHeight, setContainerHeight] = useState(320);

  // Keep a ref to the latest scroll position so the resize observer
  // callback doesn't need scrollTop in its dependency array.
  const scrollTopRef = useRef(0);

  /**
   * Scroll handler — captures how far the user has scrolled.
   * Uses requestAnimationFrame to batch updates with the browser's
   * paint cycle, preventing layout thrashing on fast scrolls.
   */
  const rafIdRef = useRef<number | null>(null);
  
  const handleScroll = useCallback((): void => {
    const container = containerRef.current;
    if (!container) return;

    const latestScrollTop = container.scrollTop;
    scrollTopRef.current = latestScrollTop;

    // Cancel any pending rAF to avoid queuing multiple updates
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // rAF ensures we only update state once per frame even if the
    // browser fires multiple scroll events between paints.
    rafIdRef.current = requestAnimationFrame(() => {
      setScrollTop(latestScrollTop);
      rafIdRef.current = null;
    });
  }, [containerRef]);

  /**
   * Attach scroll listener + measure container height.
   *
   * We use ResizeObserver to track container height changes (e.g. if the
   * window is resized or a parent layout shifts). This keeps our
   * visibleCount calculation accurate without polling.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------------------------------------------------------
    // 🔴 FIX: SYNC STATE IMMEDIATELY ON MOUNT / REF CHANGE
    // ---------------------------------------------------------
    // When the dropdown re-opens, the DOM scrollTop is 0, but 
    // our React state might still be at the previous scroll position.
    // We must forcibly sync them to prevent rendering blank space.
    if (container.scrollTop !== scrollTopRef.current) {
        setScrollTop(container.scrollTop);
        scrollTopRef.current = container.scrollTop;
    }
    
    // Also sync the container height immediately
    setContainerHeight(container.clientHeight);
    // ---------------------------------------------------------

    // Listen for scroll
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Track container resize - only update if height actually changed
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        setContainerHeight((prevHeight) => {
          if (Math.abs(newHeight - prevHeight) > 1) {
            return newHeight;
          }
          return prevHeight;
        });
      }
    });
    resizeObserver.observe(container);

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [containerRef, handleScroll]);

  // ─── The core math (see JSDoc above for full explanation) ───

  /** Total pixel height for the scrollbar spacer div */
  const totalHeight = itemCount * itemHeight;

  // Safety check: ensure calculations don't result in NaN if itemHeight is 0
  const safeItemHeight = itemHeight || 32;

  /**
   * rawStartIndex: which row's top edge is at or above the viewport top?
   * We floor because scrollTop 33px with 32px rows means row 1 is the
   * first fully visible row, not row 0.
   */
  const rawStartIndex = Math.floor(scrollTop / safeItemHeight);

  /**
   * visibleNodeCount: how many rows fit in the viewport?
   * Ceil handles partial rows — if the container is 100px tall and rows
   * are 32px, we need ceil(100/32) = 4 rows, not floor = 3.
   * Add +1 to ensure we render one extra row for smooth scrolling.
   */
  const visibleNodeCount = Math.ceil(containerHeight / safeItemHeight) + 1;



  /**
   * Clamp start/end with overscan buffer.
   * max(0, ...) prevents negative indices.
   * min(itemCount - 1, ...) prevents reading past the array.
   */
  const startIndex = Math.max(0, rawStartIndex - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    rawStartIndex + visibleNodeCount + overscan,
  );

  /** Build the array of items the component should actually render. */
  const virtualItems: VirtualItem[] = [];

  // Guard against empty lists (itemCount = 0 → endIndex = -1)
  if (itemCount > 0) {
    for (
      let currentIndex = startIndex;
      currentIndex <= endIndex;
      currentIndex++
    ) {
      virtualItems.push({
        index: currentIndex,
        offsetTop: currentIndex * safeItemHeight,
      });
    }
  }

  return { virtualItems, totalHeight };
}
