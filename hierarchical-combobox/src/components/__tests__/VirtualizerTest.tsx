import { useRef } from 'react';
import { useVirtualizer } from '../../hooks/useVirtualizer';

/**
 * Temporary test harness — renders 10,000 rows using the custom virtualizer.
 *
 * Open your browser DevTools → Performance tab and scroll aggressively.
 * You should see only ~20-30 DOM nodes in the Elements panel at any time,
 * not 10,000. That's the whole point.
 *
 * DELETE THIS FILE once Phase 3 is verified.
 */

const TOTAL_ITEMS = 10_000;
const ROW_HEIGHT_PX = 32;

export function VirtualizerTest(): React.JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight } = useVirtualizer({
    containerRef: scrollContainerRef,
    itemCount: TOTAL_ITEMS,
    itemHeight: ROW_HEIGHT_PX,
    overscan: 5,
  });

  return (
    <div className="mx-auto max-w-xl p-lg">
      <h2 className="mb-sm text-lg font-semibold text-neutral-800">
        Virtualizer Test — {TOTAL_ITEMS.toLocaleString()} rows
      </h2>
      <p className="mb-md text-sm text-neutral-500">
        Only ~{virtualItems.length} DOM nodes are mounted right now.
        Check Elements panel to verify.
      </p>

      {/* Scroll container — fixed height, overflow-y scroll */}
      <div
        ref={scrollContainerRef}
        className="relative h-96 overflow-y-auto rounded-md border border-neutral-300 bg-white"
      >
        {/* Inner spacer — its height drives the scrollbar size */}
        <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.index}
              className="absolute left-0 right-0 flex items-center border-b border-neutral-100 px-md text-sm text-neutral-700"
              style={{
                height: `${ROW_HEIGHT_PX}px`,
                top: `${virtualItem.offsetTop}px`,
              }}
            >
              Row #{virtualItem.index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
