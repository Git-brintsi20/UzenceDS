import { useCallback } from 'react';
import type { FlatNode } from '../../types/tree';

/** Pixels of left padding added per depth level */
const INDENT_PX = 20;

interface TreeRowProps {
  flatNode: FlatNode;
  /** Absolute pixel offset from the top of the scroll content */
  offsetTop: number;
  /** Row height in pixels — must match the virtualizer's itemHeight */
  rowHeight: number;
  /** Whether this row is the keyboard-highlighted (active descendant) row */
  isHighlighted: boolean;
  /** Unique DOM id for this option — used by aria-activedescendant */
  optionId: string;
  onToggleExpand: (nodeId: string) => void;
  onToggleSelect: (nodeId: string) => void;
  /**
   * When defined, the row is displayed in "search result" mode:
   *  - Expand/collapse button is hidden
   *  - Matching text in the label is highlighted
   *  - Ancestry breadcrumb is shown below the label (if available)
   */
  searchQuery?: string;
}

/**
 * TreeRow — a single absolutely-positioned row inside the virtualized list.
 *
 * Renders in two layout modes:
 *
 * **Tree mode** (searchQuery undefined):
 *   [indent] [▸ expand] [☐ checkbox] [label]
 *   Row height: 32px. Depth controls indentation.
 *
 * **Search mode** (searchQuery defined):
 *   [☐ checkbox] [Highlighted label]
 *                 [breadcrumb path in gray]
 *   Row height: 44px. No indentation. Expand button hidden.
 *
 * ARIA:
 *   role="option", aria-selected, aria-expanded (branches in tree mode).
 *   The row's DOM id feeds aria-activedescendant on the input.
 */
export function TreeRow({
  flatNode,
  offsetTop,
  rowHeight,
  isHighlighted,
  optionId,
  onToggleExpand,
  onToggleSelect,
  searchQuery,
}: TreeRowProps): React.JSX.Element {
  const { node, depth } = flatNode;
  const isInSearchMode = searchQuery !== undefined;

  const handleExpandClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      onToggleExpand(node.id);
    },
    [node.id, onToggleExpand],
  );

  const handleCheckboxClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
    },
    [],
  );

  const handleCheckboxChange = useCallback((): void => {
    onToggleSelect(node.id);
  }, [node.id, onToggleSelect]);

  const handleRowClick = useCallback((): void => {
    onToggleSelect(node.id);
  }, [node.id, onToggleSelect]);

  /**
   * Indentation math:
   *   Tree mode:   12px base + depth × 20px per level
   *   Search mode: 12px flat (no nesting)
   */
  const indentPx = isInSearchMode ? 12 : 12 + depth * INDENT_PX;

  return (
    <div
      id={optionId}
      role="option"
      aria-selected={node.isSelected}
      aria-expanded={!isInSearchMode && node.hasChildren ? node.isOpen : undefined}
      onClick={handleRowClick}
      className={[
        'absolute left-0 right-0 flex cursor-pointer items-center text-sm',
        'transition-colors duration-75',
        isHighlighted
          ? 'bg-blue-50'
          : 'hover:bg-gray-50',
      ].join(' ')}
      style={{
        height: `${rowHeight}px`,
        top: `${offsetTop}px`,
        paddingLeft: `${indentPx}px`,
        paddingRight: '12px',
      }}
    >
      {/* ── Expand/Collapse toggle (tree mode only) ── */}
      {!isInSearchMode && (
        node.hasChildren ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleExpandClick}
            className={[
              'mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center',
              'rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700',
              'transition-colors duration-100',
            ].join(' ')}
            aria-label={node.isOpen ? `Collapse ${node.label}` : `Expand ${node.label}`}
            aria-hidden="true"
          >
            {node.isLoading ? (
              <span className="block h-3 w-3 animate-pulse rounded-sm bg-gray-300" />
            ) : (
              <svg
                className={[
                  'h-3.5 w-3.5 transition-transform duration-150',
                  node.isOpen ? 'rotate-90' : '',
                ].join(' ')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ) : (
          <span className="mr-1 inline-block h-5 w-5 flex-shrink-0" aria-hidden="true" />
        )
      )}

      {/* ── Checkbox ── */}
      <input
        type="checkbox"
        tabIndex={-1}
        checked={node.isSelected}
        ref={(inputElement): void => {
          if (inputElement) {
            inputElement.indeterminate = node.isIndeterminate;
          }
        }}
        onClick={handleCheckboxClick}
        onChange={handleCheckboxChange}
        className={[
          'mr-2 h-4 w-4 flex-shrink-0 cursor-pointer rounded',
          'border-gray-300 text-blue-600',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        ].join(' ')}
        aria-label={`Select ${node.label}`}
      />

      {/* ── Label (+ breadcrumb in search mode) ── */}
      <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
        <span
          className={[
            'truncate',
            node.isSelected ? 'font-medium text-gray-900' : 'text-gray-700',
          ].join(' ')}
        >
          {searchQuery ? (
            <HighlightedLabel text={node.label} query={searchQuery} />
          ) : (
            node.label
          )}
        </span>

        {flatNode.breadcrumb && (
          <span className="truncate text-xs leading-tight text-gray-400">
            {flatNode.breadcrumb}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Inline helper: highlight the matching substring ──────────

/**
 * Splits `text` around the first occurrence of `query` (case-insensitive)
 * and wraps the match in a <mark> element with a soft highlight.
 */
function HighlightedLabel({
  text,
  query,
}: {
  text: string;
  query: string;
}): React.JSX.Element {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1 || lowerQuery === '') {
    return <>{text}</>;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + lowerQuery.length);
  const after = text.slice(matchIndex + lowerQuery.length);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-yellow-100 text-gray-900">{match}</mark>
      {after}
    </>
  );
}
