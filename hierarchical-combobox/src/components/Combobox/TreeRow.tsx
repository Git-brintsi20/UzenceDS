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
}

/**
 * TreeRow — a single absolutely-positioned row inside the virtualized list.
 *
 * Indentation:
 *   paddingLeft = depth × INDENT_PX
 *   This creates the visual nesting without nested DOM elements.
 *   A root node (depth 0) has no extra padding. A grandchild (depth 2)
 *   gets 40px of indent.
 *
 * Loading skeleton:
 *   When a node's children are being fetched (isLoading = true),
 *   the expand icon is replaced with a pulsing bar. This gives
 *   the user immediate feedback that something is happening.
 *
 * ARIA:
 *   Each row carries role="option" and aria-selected reflecting the
 *   checkbox selection state. Branch nodes also carry aria-expanded.
 *   The row's DOM id is used by the trigger's aria-activedescendant
 *   to communicate the current keyboard-highlighted item to assistive
 *   technology.
 */
export function TreeRow({
  flatNode,
  offsetTop,
  rowHeight,
  isHighlighted,
  optionId,
  onToggleExpand,
  onToggleSelect,
}: TreeRowProps): React.JSX.Element {
  const { node, depth } = flatNode;

  const handleExpandClick = useCallback(
    (event: React.MouseEvent): void => {
      // Prevent the click from also toggling selection
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

  /** Clicking anywhere on the row (outside expand/checkbox) toggles selection */
  const handleRowClick = useCallback((): void => {
    onToggleSelect(node.id);
  }, [node.id, onToggleSelect]);

  /**
   * Indentation math:
   * Each depth level pushes the row content rightward by INDENT_PX.
   * We also add a base padding (12px) so root nodes aren't flush
   * against the container edge.
   */
  const indentPx = 12 + depth * INDENT_PX;

  return (
    <div
      id={optionId}
      role="option"
      aria-selected={node.isSelected}
      aria-expanded={node.hasChildren ? node.isOpen : undefined}
      onClick={handleRowClick}
      className={[
        'absolute left-0 right-0 flex cursor-pointer items-center text-sm',
        'transition-colors duration-75',
        isHighlighted ? 'bg-primary-50' : 'hover:bg-neutral-50',
      ].join(' ')}
      style={{
        height: `${rowHeight}px`,
        top: `${offsetTop}px`,
        paddingLeft: `${indentPx}px`,
      }}
    >
      {/* ── Expand/Collapse toggle ── */}
      {node.hasChildren ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleExpandClick}
          className={[
            'mr-xs flex h-5 w-5 flex-shrink-0 items-center justify-center',
            'rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
            'transition-colors duration-100',
          ].join(' ')}
          aria-label={node.isOpen ? `Collapse ${node.label}` : `Expand ${node.label}`}
          aria-hidden="true"
        >
          {node.isLoading ? (
            /* Loading skeleton — pulsing bar replaces the chevron */
            <span className="block h-3 w-3 animate-pulse rounded-sm bg-neutral-300" />
          ) : (
            /* Chevron — points right when collapsed, down when expanded */
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
        /* Leaf node spacer — keeps labels aligned with branch nodes */
        <span className="mr-xs inline-block h-5 w-5 flex-shrink-0" aria-hidden="true" />
      )}

      {/* ── Checkbox ── */}
      <input
        type="checkbox"
        tabIndex={-1}
        checked={node.isSelected}
        ref={(inputElement) => {
          if (inputElement) {
            inputElement.indeterminate = node.isIndeterminate;
          }
        }}
        onClick={handleCheckboxClick}
        onChange={handleCheckboxChange}
        className={[
          'mr-sm h-4 w-4 flex-shrink-0 cursor-pointer rounded-sm',
          'border-neutral-300 text-primary-600',
          'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        ].join(' ')}
        aria-label={`Select ${node.label}`}
      />

      {/* ── Label ── */}
      <span
        className={[
          'truncate',
          node.isSelected ? 'font-medium text-neutral-900' : 'text-neutral-700',
        ].join(' ')}
      >
        {node.label}
      </span>
    </div>
  );
}
