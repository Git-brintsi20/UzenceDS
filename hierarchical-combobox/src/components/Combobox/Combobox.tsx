import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTreeData } from '../../hooks/useTreeData';
import type { UseTreeDataConfig } from '../../hooks/useTreeData';
import { useVirtualizer } from '../../hooks/useVirtualizer';
import { searchTree } from '../../logic/tree-utils';
import { TreeRow } from './TreeRow';
import { SelectedTags } from './SelectedTags';
import type { TreeNode } from '../../types/tree';

/** Fixed row height in pixels for the normal tree view */
const ROW_HEIGHT_PX = 32;

/** Taller row height (px) for search results that include ancestry breadcrumbs */
const SEARCH_ROW_HEIGHT_PX = 44;

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
 * Two rendering modes
 * ───────────────────
 * **Tree mode** (default): A hierarchical tree view with expand/collapse,
 * indentation, and async lazy-loading of children.
 *
 * **Search mode** (activated when the user types in the input): A flat
 * filtered list with matching text highlighted and ancestry breadcrumbs
 * showing where each result lives in the hierarchy. This is the
 * "search with context preservation" feature.
 *
 * ARIA 1.2 Combobox Pattern
 * ─────────────────────────
 * The text input has role="combobox" with:
 *   - aria-expanded:         true when dropdown is open
 *   - aria-controls:         points to the listbox id
 *   - aria-activedescendant: points to the currently highlighted option
 *
 * Keyboard Navigation
 * ───────────────────
 *   ArrowDown  → move highlight to next row (opens dropdown if closed)
 *   ArrowUp    → move highlight to previous row
 *   ArrowRight → expand highlighted node (tree mode only)
 *   ArrowLeft  → collapse highlighted node (tree mode only)
 *   Enter      → toggle selection on highlighted node
 *   Home       → jump to first row
 *   End        → jump to last row
 *   Escape     → clears search query, then closes dropdown
 */
export function Combobox(props: ComboboxProps = {}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');

  const treeConfig: UseTreeDataConfig = {};
  if (props.initialRootNodes) treeConfig.initialRootNodes = props.initialRootNodes;
  if (props.fetchChildrenFn) treeConfig.fetchChildrenFn = props.fetchChildrenFn;

  const { flatNodes, rootNodes, selectedNodes, error, toggleExpand, toggleSelect, deselectNode, clearError } =
    useTreeData(treeConfig);

  /** Search results — computed from the full tree whenever the query changes */
  const searchResults = useMemo(
    () => (searchQuery.trim().length > 0 ? searchTree(rootNodes, searchQuery) : []),
    [rootNodes, searchQuery],
  );

  const isSearchMode = searchQuery.trim().length > 0;
  const displayNodes = useMemo(() => {
    const nodes = isSearchMode ? searchResults : flatNodes;
    // Filter out any null/undefined entries to prevent rendering issues
    return nodes.filter((node) => node && node.node && node.node.id);
  }, [isSearchMode, searchResults, flatNodes]);
  const currentRowHeight = isSearchMode ? SEARCH_ROW_HEIGHT_PX : ROW_HEIGHT_PX;

  /** Ref for the scrollable dropdown container — fed to the virtualizer */
  const dropdownScrollRef = useRef<HTMLDivElement>(null);

  /** Ref for the entire combobox wrapper — used for outside-click detection */
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);

  /** Ref for the text input (role=combobox) */
  const inputRef = useRef<HTMLInputElement>(null);

  const { virtualItems, totalHeight } = useVirtualizer({
    containerRef: dropdownScrollRef,
    itemCount: displayNodes.length,
    itemHeight: currentRowHeight,
    overscan: 5,
  });

  const listboxId = 'hcb-listbox';

  /**
   * Derive the DOM id of the currently highlighted option.
   * Returns undefined when nothing is highlighted (-1) so
   * aria-activedescendant is omitted entirely.
   */
  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < displayNodes.length
      ? `${OPTION_ID_PREFIX}${displayNodes[highlightedIndex]?.node.id ?? ''}`
      : undefined;

  // ── Close on outside click ──

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const wrapper = comboboxWrapperRef.current;
      if (!wrapper) return;

      if (!wrapper.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
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
    const rowTop = highlightedIndex * currentRowHeight;
    const rowBottom = rowTop + currentRowHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (rowTop < visibleTop) {
      container.scrollTop = rowTop;
    } else if (rowBottom > visibleBottom) {
      container.scrollTop = rowBottom - container.clientHeight;
    }
  }, [highlightedIndex, currentRowHeight]);

  // ── Reset scroll position when switching between tree/search modes ──

  useEffect(() => {
    if (dropdownScrollRef.current) {
      dropdownScrollRef.current.scrollTop = 0;
    }
  }, [isSearchMode]);

  // ── Wrapper click — opens dropdown, focuses input ──

  const handleWrapperClick = useCallback(
    (event: React.MouseEvent): void => {
      // If the click target is the input, just open (don't toggle)
      if (event.target === inputRef.current) {
        if (!isOpen) setIsOpen(true);
        return;
      }
      // For all other areas: toggle open/close
      inputRef.current?.focus();
      setIsOpen((prev) => {
        const next = !prev;
        if (!next) {
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
        return next;
      });
    },
    [isOpen],
  );

  // ── Chevron click — toggles dropdown ──

  const handleChevronClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      inputRef.current?.focus();
      setIsOpen((prev) => {
        const next = !prev;
        if (!next) {
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
        return next;
      });
    },
    [],
  );

  // ── Search input change ──

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value;
      setSearchQuery(value);
      setHighlightedIndex(-1);
      if (!isOpen) setIsOpen(true);
    },
    [isOpen],
  );

  // ── Keyboard handler ──

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      const nodeCount = displayNodes.length;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) => Math.min(prev + 1, nodeCount - 1));
          }
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        }

        case 'ArrowRight': {
          // Only expand in tree mode
          if (!isSearchMode && isOpen && highlightedIndex >= 0) {
            event.preventDefault();
            const focusedNode = displayNodes[highlightedIndex];
            if (focusedNode && focusedNode.node.hasChildren && !focusedNode.node.isOpen) {
              toggleExpand(focusedNode.node.id);
            }
          }
          break;
        }

        case 'ArrowLeft': {
          // Only collapse in tree mode
          if (!isSearchMode && isOpen && highlightedIndex >= 0) {
            event.preventDefault();
            const focusedNode = displayNodes[highlightedIndex];
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
            const focusedNode = displayNodes[highlightedIndex];
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
          if (isSearchMode) {
            // First Escape: clear search but keep dropdown open
            setSearchQuery('');
            setHighlightedIndex(-1);
          } else {
            // Second Escape (or first if no search): close dropdown
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        }

        default:
          break;
      }
    },
    [isOpen, isSearchMode, highlightedIndex, displayNodes, toggleExpand, toggleSelect],
  );

  return (
    <div ref={comboboxWrapperRef} className="relative w-full max-w-lg">
      {/* ── Trigger area with tags + search input ── */}
      <div
        onClick={handleWrapperClick}
        className={[
          'flex min-h-[2.5rem] w-full cursor-text flex-wrap items-center gap-1',
          'rounded-md border bg-white px-3 py-1.5',
          'transition-all duration-150',
          isOpen
            ? 'border-blue-500 shadow-sm'
            : 'border-gray-300 hover:border-gray-400',
        ].join(' ')}
      >
        {/* Selected tags */}
        {selectedNodes.length > 0 && (
          <SelectedTags
            selectedNodes={selectedNodes}
            onRemove={deselectNode}
          />
        )}

        {/* Search / combobox input */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen ? activeDescendantId : undefined}
          aria-label="Select items from hierarchical list"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedNodes.length > 0 ? '' : 'Type to search or click to browse…'}
          autoComplete="off"
          className={[
            'min-w-[120px] flex-1 border-0 bg-transparent py-1 text-sm',
            'text-gray-900 outline-none placeholder:text-gray-400',
          ].join(' ')}
        />

        {/* Chevron toggle */}
        <button
          type="button"
          tabIndex={-1}
          onClick={handleChevronClick}
          className="ml-auto flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
        >
          <svg
            className={[
              'h-4 w-4 transition-transform duration-200',
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
      </div>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {/* Search-mode "no results" message */}
          {isSearchMode && displayNodes.length === 0 && (
            <div className="px-4 py-3 text-center text-sm text-gray-500" role="status">
              No results for &ldquo;{searchQuery}&rdquo;
            </div>
          )}

          {/* Scrollable virtualized list */}
          <div
            ref={dropdownScrollRef}
            id={listboxId}
            role="listbox"
            aria-label="Hierarchical options"
            aria-multiselectable="true"
            className="relative overflow-y-auto"
            style={{ maxHeight: '320px' }}
          >
            {displayNodes.length > 0 && (
              <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
                {virtualItems.map((virtualItem) => {
                  const flatNode = displayNodes[virtualItem.index];
                  if (!flatNode) return null;

                  return (
                    <TreeRow
                      key={flatNode.node.id}
                      flatNode={flatNode}
                      offsetTop={virtualItem.offsetTop}
                      rowHeight={currentRowHeight}
                      isHighlighted={virtualItem.index === highlightedIndex}
                      optionId={`${OPTION_ID_PREFIX}${flatNode.node.id}`}
                      onToggleExpand={toggleExpand}
                      onToggleSelect={toggleSelect}
                      searchQuery={isSearchMode ? searchQuery : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Empty state — no items at all (tree mode) */}
          {!isSearchMode && flatNodes.length === 0 && !error && (
            <div className="px-4 py-3 text-center text-sm text-gray-400" role="status">
              No items available
            </div>
          )}

          {/* Error banner — shown when an async fetch fails */}
          {error && (
            <div
              role="alert"
              className="flex items-center justify-between border-t border-red-500/20 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              <span>{error}</span>
              <button
                type="button"
                tabIndex={-1}
                onClick={clearError}
                className="ml-2 text-xs font-medium underline hover:text-red-500"
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
