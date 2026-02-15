/**
 * Core type definitions for the hierarchical tree data model.
 *
 * These types define the shape of tree nodes, their selection states,
 * and the async loading contract used by the combobox.
 */

/** Unique identifier for each tree node */
export type NodeId = string;

/** Represents the selection state of a checkbox in the tree */
export type CheckState = 'checked' | 'unchecked' | 'indeterminate';

/**
 * Raw tree node as received from the (simulated) API.
 * Children may be absent if the node hasn't been expanded yet (async loading).
 */
export interface TreeNodeData {
  readonly id: NodeId;
  readonly label: string;
  readonly parentId: NodeId | null;
  /** If true, this node can be expanded to reveal child nodes */
  readonly hasChildren: boolean;
  readonly children?: readonly TreeNodeData[];
}

/**
 * Flattened representation of a tree node used for virtualized rendering.
 * Contains pre-computed depth and expansion state so the virtualizer
 * doesn't need to traverse the tree on every frame.
 */
export interface FlatTreeNode {
  readonly id: NodeId;
  readonly label: string;
  readonly parentId: NodeId | null;
  readonly depth: number;
  readonly hasChildren: boolean;
  readonly isExpanded: boolean;
  readonly isLoading: boolean;
  readonly checkState: CheckState;
  /** Breadcrumb trail for search-context display (e.g. "Region > Country > City") */
  readonly ancestorLabels: readonly string[];
}
