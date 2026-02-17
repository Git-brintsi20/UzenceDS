import { useState, useLayoutEffect, useCallback, useRef } from 'react';

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
  const [containerHeight, setContainerHeight] = useState(0);

  // We use a Ref for scrollTop to avoid stale closures in the scroll handler
  // without needing to re-bind the event listener on every scroll.
  const scrollTopRef = useRef(0);

  const rafIdRef = useRef<number | null>(null);

  /**
   * Scroll Handler:
   * Batches updates using requestAnimationFrame to prevent layout thrashing.
   */
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const currentScrollTop = containerRef.current.scrollTop;
    scrollTopRef.current = currentScrollTop;

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        setScrollTop(currentScrollTop);
        rafIdRef.current = null;
      });
    }
  }, [containerRef]);

  /**
   * Layout Effect:
   * Uses useLayoutEffect to sync DOM measurements synchronously BEFORE paint.
   * This prevents the "flash" of missing items when expanding nodes.
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Immediate Sync: Force React state to match DOM reality right now.
    // If the container just opened, scrollTop is 0.
    // If we expanded a node, containerHeight might have grown.
    if (container.scrollTop !== scrollTopRef.current) {
      setScrollTop(container.scrollTop);
      scrollTopRef.current = container.scrollTop;
    }
    
    // Always measure height on mount/update
    setContainerHeight(container.clientHeight);

    // 2. Attach Listeners
    container.addEventListener('scroll', handleScroll, { passive: true });

    // 3. Observer for dynamic resizing (window resize)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // We only update if the height actually changed to avoid render loops
        const newHeight = entry.contentRect.height;
        setContainerHeight((prev) => 
          Math.abs(newHeight - prev) > 0.5 ? newHeight : prev
        );
      }
    });
    
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [containerRef, handleScroll, itemCount]); 
  // ^^^ DEPENDENCY ON itemCount IS CRITICAL:
  // When list grows, we MUST re-measure containerHeight immediately.

  // ─── Math Calculation ───

  const totalHeight = itemCount * itemHeight;
  
  // Prevent division by zero or NaN issues
  const safeItemHeight = itemHeight || 32;
  const safeContainerHeight = containerHeight || 320; // Default fallback

  // Calculate visible range
  const rawStartIndex = Math.floor(scrollTop / safeItemHeight);
  const visibleNodeCount = Math.ceil(safeContainerHeight / safeItemHeight);

  // Apply overscan (buffer)
  const startIndex = Math.max(0, rawStartIndex - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    rawStartIndex + visibleNodeCount + overscan
  );

  const virtualItems: VirtualItem[] = [];

  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      offsetTop: i * safeItemHeight,
    });
  }

  return { virtualItems, totalHeight };
}
