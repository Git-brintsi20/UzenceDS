import { useCallback } from 'react';
import type { SelectedNode } from '../../hooks/useTreeData';

interface SelectedTagsProps {
  selectedNodes: SelectedNode[];
  onRemove: (nodeId: string) => void;
}

/**
 * Maximum number of tag pills rendered inline.
 * Beyond this count we show a "+N more" indicator to keep
 * the input area from growing unbounded.
 */
const MAX_VISIBLE_TAGS = 5;

/**
 * SelectedTags — pill-style tags displayed inside the combobox input area.
 *
 * Each tag shows the node's label and an × button to deselect it.
 * When more than MAX_VISIBLE_TAGS are selected, the overflow is
 * collapsed into a "+N more" badge.
 *
 * Returns a Fragment so the parent container's flex-wrap layout
 * can interleave tags with the search input on the same line.
 */
export function SelectedTags({
  selectedNodes,
  onRemove,
}: SelectedTagsProps): React.JSX.Element | null {
  if (selectedNodes.length === 0) return null;

  const visibleTags = selectedNodes.slice(0, MAX_VISIBLE_TAGS);
  const overflowCount = selectedNodes.length - MAX_VISIBLE_TAGS;

  return (
    <>
      {visibleTags.map((selectedNode) => (
        <Tag
          key={selectedNode.id}
          nodeId={selectedNode.id}
          label={selectedNode.label}
          onRemove={onRemove}
        />
      ))}

      {overflowCount > 0 && (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          +{overflowCount} more
        </span>
      )}
    </>
  );
}

// ── Individual tag pill ──────────────────────────────────

interface TagProps {
  nodeId: string;
  label: string;
  onRemove: (nodeId: string) => void;
}

/**
 * A single tag pill with a dismiss button.
 *
 * The × button calls onRemove which triggers deselectNode
 * in the tree hook — this propagates the deselection downward
 * to children and recalculates parent indeterminate states.
 */
function Tag({ nodeId, label, onRemove }: TagProps): React.JSX.Element {
  const handleRemove = useCallback(
    (event: React.MouseEvent): void => {
      // Stop propagation so clicking the × doesn't also toggle the
      // combobox open/close state.
      event.stopPropagation();
      onRemove(nodeId);
    },
    [nodeId, onRemove],
  );

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
      <span className="max-w-24 truncate">{label}</span>
      <button
        type="button"
        onClick={handleRemove}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900"
        aria-label={`Remove ${label}`}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
