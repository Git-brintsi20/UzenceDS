import { useState, useRef, useCallback, useEffect } from 'react';
import { useTreeData } from '../../hooks/useTreeData';
import type { UseTreeDataConfig } from '../../hooks/useTreeData';
import { useVirtualizer } from '../../hooks/useVirtualizer';
import { TreeRow } from './TreeRow';
import { SelectedTags } from './SelectedTags';
import type { TreeNode } from '../../types/tree';

/** Fixed row height in pixels — must match the design token --combobox-row-height (2rem = 32px) */
const ROW_HEIGHT_PX = 32;

/** Unique prefix for generating DOM ids on each tree option row */
const OPTION_ID_PREFIX = 'hcb-option-';

/**
 * Props for the Combobox component.
 *
 * Both fields are optional — the component works out of the box with
 * the default mock loader and 8-department root set. Stories and tests
 * use these props to inject large datasets, slow APIs, or failing fetchers.
 */
export interface ComboboxProps {
  /** Override the initial root nodes (defaults to 8 departments) */
  initialRootNodes?: TreeNode[];
  /** Override the child-fetch function (defaults to mock loader with 500ms delay) */
  fetchChildrenFn?: (
    parentId: string,
    parentLabel: string,
  ) => Promise<TreeNode[]>;
}

/**
 * HierarchicalCombobox — the root component.
 *
 * ARIA 1.2 Combobox Pattern
 * ─────────────────────────
 * The input has role="combobox" with:
 *   - aria-expanded:         true when dropdown is open
 *   - aria-controls:         points to the listbox id
 *   - aria-activedescendant: points to the currently highlighted option's DOM id
 *
 * The listbox has role="listbox" with:
 *   - Each visible row has role="option"
 *   - aria-selected reflects the checkbox selection state
 *
 * Keyboard Navigation
 * ───────────────────
 * Focus stays on the input at all times. We track a "highlighted index"
 * into the flatNodes array and use aria-activedescendant to communicate
 * the active row to screen readers. This avoids the complexity of
 * physically moving focus into virtualized rows that may not be in the DOM.
 *
 *   ArrowDown  → move highlight to next row
 *   ArrowUp    → move highlight to previous row
 *   ArrowRight → expand the highlighted node (if collapsed & has children)
 *   ArrowLeft  → collapse the highlighted node (if expanded)
 *   Enter      → toggle selection on the highlighted node
 *   Home       → jump to first row
 *   End        → jump to last row
 *   Escape     → close dropdown
 *
 * Scroll-into-view
 * ────────────────
 * When the highlighted index changes via keyboard, we scroll the container
 * so the highlighted row is visible. The math:
 *
 *   targetScrollTop = highlightedIndex × ROW_HEIGHT_PX
 *
 *   If targetScrollTop < container.scrollTop → scroll up to show the row.
 *   If targetScrollTop + ROW_HEIGHT > container.scrollTop + containerHeight
 *     → scroll down so the row's bottom edge is visible.
 */
export function Combobox(props: ComboboxProps = {}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const treeConfig: UseTreeDataConfig = {};
  if (props.initialRootNodes) treeConfig.initialRootNodes = props.initialRootNodes;
  if (props.fetchChildrenFn) treeConfig.fetchChildrenFn = props.fetchChildrenFn;

  const { flatNodes, selectedNodes, error, toggleExpand, toggleSelect, deselectNode, clearError } =
    useTreeData(treeConfig);

  /** Ref for the scrollable dropdown container — fed to the virtualizer */
  const dropdownScrollRef = useRef<HTMLDivElement>(null);

  /** Ref for the entire combobox wrapper — used for outside-click detection */
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);

  /** Ref for the trigger — we re-focus it after keyboard actions */
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { virtualItems, totalHeight } = useVirtualizer({
    containerRef: dropdownScrollRef,
    itemCount: flatNodes.length,
    itemHeight: ROW_HEIGHT_PX,
    overscan: 5,
  });

  const listboxId = 'hcb-listbox';

  /**
   * Derive the DOM id of the currently highlighted option.
   * Returns undefined when nothing is highlighted (-1) so
   * aria-activedescendant is omitted entirely — which is the
   * correct behavior per ARIA spec when no option is active.
   */
  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < flatNodes.length
      ? `${OPTION_ID_PREFIX}${flatNodes[highlightedIndex]?.node.id ?? ''}`
      : undefined;

  // ── Close on outside click ──

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const wrapper = comboboxWrapperRef.current;
      if (!wrapper) return;

      if (!wrapper.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ── Scroll the highlighted row into view ──

  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownScrollRef.current) return;

    const container = dropdownScrollRef.current;
    const rowTop = highlightedIndex * ROW_HEIGHT_PX;
    const rowBottom = rowTop + ROW_HEIGHT_PX;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    // Row is above the visible area — scroll up
    if (rowTop < visibleTop) {
      container.scrollTop = rowTop;
    }
    // Row is below the visible area — scroll down just enough
    else if (rowBottom > visibleBottom) {
      container.scrollTop = rowBottom - container.clientHeight;
    }
  }, [highlightedIndex]);

  // ── Click handler ──

  const handleInputClick = useCallback((): void => {
    setIsOpen((previous) => {
      const next = !previous;
      if (!next) {
        setHighlightedIndex(-1);
      }
      return next;
    });
  }, []);

  // ── Keyboard handler ──

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      const nodeCount = flatNodes.length;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            // First press opens the dropdown and highlights the first item
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            // Move highlight down, clamped to the last item
            setHighlightedIndex((prev) => Math.min(prev + 1, nodeCount - 1));
          }
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          if (isOpen) {
            // Move highlight up, clamped to 0
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        }

        case 'ArrowRight': {
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const focusedNode = flatNodes[highlightedIndex];
            if (focusedNode && focusedNode.node.hasChildren && !focusedNode.node.isOpen) {
              toggleExpand(focusedNode.node.id);
            }
          }
          break;
        }

        case 'ArrowLeft': {
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const focusedNode = flatNodes[highlightedIndex];
            if (focusedNode && focusedNode.node.isOpen) {
              toggleExpand(focusedNode.node.id);
            }
          }
          break;
        }

        case 'Enter': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else if (highlightedIndex >= 0) {
            const focusedNode = flatNodes[highlightedIndex];
            if (focusedNode) {
              toggleSelect(focusedNode.node.id);
            }
          }
          break;
        }

        case 'Home': {
          event.preventDefault();
          if (isOpen && nodeCount > 0) {
            setHighlightedIndex(0);
          }
          break;
        }

        case 'End': {
          event.preventDefault();
          if (isOpen && nodeCount > 0) {
            setHighlightedIndex(nodeCount - 1);
          }
          break;
        }

        case 'Escape': {
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          // Return focus to trigger so the user can re-open with Enter
          triggerRef.current?.focus();
          break;
        }

        default:
          break;
      }
    },
    [isOpen, highlightedIndex, flatNodes, toggleExpand, toggleSelect],
  );

  return (
    <div ref={comboboxWrapperRef} className="relative w-full max-w-md">
      {/* ── Input trigger with tags ── */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen ? activeDescendantId : undefined}
        aria-label="Select items from hierarchical list"
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
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
          aria-hidden="true"
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
            id={listboxId}
            role="listbox"
            aria-label="Hierarchical options"
            aria-multiselectable="true"
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
                    isHighlighted={virtualItem.index === highlightedIndex}
                    optionId={`${OPTION_ID_PREFIX}${flatNode.node.id}`}
                    onToggleExpand={toggleExpand}
                    onToggleSelect={toggleSelect}
                  />
                );
              })}
            </div>
          </div>

          {/* Empty state */}
          {flatNodes.length === 0 && !error && (
            <div className="px-md py-lg text-center text-sm text-neutral-400" role="status">
              No items available
            </div>
          )}

          {/* Error banner — shown when an async fetch fails */}
          {error && (
            <div
              role="alert"
              className="flex items-center justify-between border-t border-danger-500/20 bg-danger-500/10 px-md py-sm text-sm text-danger-600"
            >
              <span>{error}</span>
              <button
                type="button"
                tabIndex={-1}
                onClick={clearError}
                className="ml-sm text-xs font-medium underline hover:text-danger-500"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
