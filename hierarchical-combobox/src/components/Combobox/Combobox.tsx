import { useState, useRef, useCallback, useEffect } from 'react';
import { useTreeData } from '../../hooks/useTreeData';
import { useVirtualizer } from '../../hooks/useVirtualizer';
import { TreeRow } from './TreeRow';
import { SelectedTags } from './SelectedTags';

/** Fixed row height in pixels — must match the design token --combobox-row-height (2rem = 32px) */
const ROW_HEIGHT_PX = 32;

/**
 * HierarchicalCombobox — the root component.
 *
 * Layout:
 *   ┌──────────────────────────────┐
 *   │  Input trigger (click/type)  │  ← relative positioned anchor
 *   └──────────────────────────────┘
 *   ┌──────────────────────────────┐
 *   │  Dropdown panel              │  ← absolute, positioned below input
 *   │  ┌────────────────────────┐  │
 *   │  │ Virtualized tree rows  │  │  ← scroll container with virtualizer
 *   │  └────────────────────────┘  │
 *   └──────────────────────────────┘
 *
 * Dropdown positioning (no popper.js):
 *   The wrapper div is `position: relative`. The dropdown is
 *   `position: absolute; top: 100%; left: 0; width: 100%`.
 *   This pins it directly below the input, matching its width.
 *   Simple, no third-party lib needed.
 */
export function Combobox(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { flatNodes, selectedNodes, toggleExpand, toggleSelect, deselectNode } = useTreeData();

  /** Ref for the scrollable dropdown container — fed to the virtualizer */
  const dropdownScrollRef = useRef<HTMLDivElement>(null);

  /** Ref for the entire combobox wrapper — used for outside-click detection */
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight } = useVirtualizer({
    containerRef: dropdownScrollRef,
    itemCount: flatNodes.length,
    itemHeight: ROW_HEIGHT_PX,
    overscan: 5,
  });

  /**
   * Close the dropdown when clicking outside.
   * We attach a mousedown listener to the document and check if the
   * click target is inside our wrapper. mousedown fires before blur,
   * which prevents race conditions with focus events.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const wrapper = comboboxWrapperRef.current;
      if (!wrapper) return;

      if (!wrapper.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputClick = useCallback((): void => {
    setIsOpen((previous) => !previous);
  }, []);

  return (
    <div ref={comboboxWrapperRef} className="relative w-full max-w-md">
      {/* ── Input trigger with tags ── */}
      <button
        type="button"
        onClick={handleInputClick}
        className={[
          'flex w-full min-h-10 items-center gap-sm',
          'rounded-md border bg-white px-md py-sm text-sm',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          isOpen
            ? 'border-primary-500 ring-1 ring-primary-500'
            : 'border-neutral-300 hover:border-neutral-400',
        ].join(' ')}
      >
        {/* Tags or placeholder text */}
        <div className="flex flex-1 flex-wrap items-center gap-xs overflow-hidden">
          {selectedNodes.length > 0 ? (
            <SelectedTags
              selectedNodes={selectedNodes}
              onRemove={deselectNode}
            />
          ) : (
            <span className="truncate text-neutral-400">Select items…</span>
          )}
        </div>

        {/* Chevron icon — rotates when open */}
        <svg
          className={[
            'ml-sm h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown panel (absolutely positioned below input) ── */}
      {isOpen && (
        <div
          className={[
            'absolute left-0 top-full z-10 mt-xs w-full',
            'rounded-md border border-neutral-200 bg-white shadow-lg',
          ].join(' ')}
        >
          {/* Scrollable container — the virtualizer measures this */}
          <div
            ref={dropdownScrollRef}
            className="relative overflow-y-auto"
            style={{ maxHeight: 'var(--combobox-max-height)' }}
          >
            {/* Spacer div — gives the scrollbar the correct total height */}
            <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
              {virtualItems.map((virtualItem) => {
                const flatNode = flatNodes[virtualItem.index];

                // Guard for noUncheckedIndexedAccess — the index could theoretically
                // be out of bounds if flatNodes changed between render frames.
                if (!flatNode) return null;

                return (
                  <TreeRow
                    key={flatNode.node.id}
                    flatNode={flatNode}
                    offsetTop={virtualItem.offsetTop}
                    rowHeight={ROW_HEIGHT_PX}
                    onToggleExpand={toggleExpand}
                    onToggleSelect={toggleSelect}
                  />
                );
              })}
            </div>
          </div>

          {/* Empty state */}
          {flatNodes.length === 0 && (
            <div className="px-md py-lg text-center text-sm text-neutral-400">
              No items available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
