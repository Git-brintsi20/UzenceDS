/**
 * Core type definitions for the hierarchical tree data model.
 *
 * TreeNode is the primary recursive structure. Each node knows whether
 * it's expanded (isOpen), selected, loading children, or has a mixed
 * selection state (isIndeterminate) because some — but not all — of
 * its descendants are checked.
 */

/** Unique identifier for each tree node */
export type NodeId = string;

/**
 * A single node in the hierarchical tree.
 *
 * `children` starts empty for nodes that haven't been fetched yet.
 * `isLoading` is true while an async fetch for that node's children
 * is in flight. `isIndeterminate` is derived — it's true when at
 * least one child is selected but not all of them are.
 */
export interface TreeNode {
  id: NodeId;
  label: string;
  children: TreeNode[];
  isOpen: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  isLoading: boolean;
  /** Signals that this node can be expanded to load children from the API */
  hasChildren: boolean;
  /** Depth level will be null until the node appears in a flattened list */
  depth?: number;
}

/**
 * A flattened representation of a tree node, used by the virtualizer.
 *
 * The virtual list can't render nested DOM — it needs a flat 1D array
 * where each entry carries its own depth so we can indent it visually.
 */
export interface FlatNode {
  /** Reference to the original TreeNode (avoids copying data) */
  node: TreeNode;
  /** How many levels deep this node sits (root = 0) */
  depth: number;
  /**
   * Ancestry breadcrumb for search results (e.g. "Engineering › Backend").
   * Only present when this FlatNode was produced by searchTree, and only
   * when the matched node has at least one ancestor.
   */
  breadcrumb?: string;
}
