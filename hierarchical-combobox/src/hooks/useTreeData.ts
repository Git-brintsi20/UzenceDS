import { useState, useMemo, useCallback } from 'react';
import type { TreeNode, FlatNode } from '../types/tree';
import { flattenTree, findNodeById } from '../logic/tree-utils';
import { fetchChildren, generateRootNodes } from '../data/mock-loader';

/**
 * useTreeData — manages the full lifecycle of the hierarchical tree.
 *
 * Responsibilities:
 *  1. Holds the root-level tree nodes in React state.
 *  2. Exposes a memoized flat list (via flattenTree) for the virtualizer.
 *  3. Handles expand/collapse toggling + async child loading.
 *  4. Handles selection toggling with parent↔child propagation.
 *
 * Why a single hook?
 * ──────────────────
 * The tree array is the single source of truth. Every mutation (toggle,
 * select, load children) produces a new root array via immutable updates,
 * which triggers React to re-render and re-memoize the flat list.
 * Splitting this across multiple hooks would force us to synchronize
 * shared state via Context — which the constraints forbid.
 */
export function useTreeData(): {
  flatNodes: FlatNode[];
  rootNodes: TreeNode[];
  toggleExpand: (nodeId: string) => void;
  toggleSelect: (nodeId: string) => void;
} {
  const [rootNodes, setRootNodes] = useState<TreeNode[]>(() =>
    generateRootNodes(),
  );

  /**
   * Memoized flat list — only recomputed when the tree structure changes.
   *
   * flattenTree is a pure function, so useMemo guarantees we don't
   * re-flatten on unrelated re-renders (e.g. a parent component's state).
   */
  const flatNodes = useMemo<FlatNode[]>(
    () => flattenTree(rootNodes),
    [rootNodes],
  );

  /**
   * Deep-clones the root tree and applies a mutation to a specific node.
   *
   * We need immutable updates for React state. Rather than a full
   * structural-sharing library, we do a targeted deep clone:
   * walk the tree, clone each node, and when we find the target,
   * apply the mutator function to the clone.
   *
   * This is O(n) where n = total nodes, which is fine for trees
   * under ~50k nodes. For larger datasets a map-based approach
   * would be better, but that's premature optimisation here.
   */
  const updateNode = useCallback(
    (
      nodeId: string,
      mutator: (node: TreeNode) => TreeNode,
    ): void => {
      setRootNodes((previousRoots) => {
        function cloneAndUpdate(nodes: TreeNode[]): TreeNode[] {
          return nodes.map((originalNode) => {
            const clonedNode: TreeNode = {
              ...originalNode,
              children: cloneAndUpdate(originalNode.children),
            };

            if (clonedNode.id === nodeId) {
              return mutator(clonedNode);
            }

            return clonedNode;
          });
        }

        return cloneAndUpdate(previousRoots);
      });
    },
    [],
  );

  /**
   * Toggles a node's expanded state. If the node has never been expanded
   * before (children array is empty but hasChildren is true), we kick
   * off an async fetch and show a loading indicator.
   */
  const toggleExpand = useCallback(
    (nodeId: string): void => {
      // Check current state to decide whether we need to fetch children.
      const targetNode = findNodeById(rootNodes, nodeId);
      if (!targetNode) return;

      // Already has children loaded — just toggle open/closed.
      if (targetNode.children.length > 0) {
        updateNode(nodeId, (node) => ({
          ...node,
          isOpen: !node.isOpen,
        }));
        return;
      }

      // Needs async loading — mark as loading, then fetch.
      if (targetNode.hasChildren && !targetNode.isLoading) {
        updateNode(nodeId, (node) => ({
          ...node,
          isLoading: true,
        }));

        void fetchChildren(nodeId, targetNode.label).then(
          (loadedChildren) => {
            updateNode(nodeId, (node) => ({
              ...node,
              children: loadedChildren,
              isLoading: false,
              isOpen: true,
            }));
          },
        );
      }
    },
    [rootNodes, updateNode],
  );

  /**
   * Toggles selection on a node and propagates the change:
   *
   *  - Downward: all descendants get the same selection state.
   *  - Upward:   parent nodes recalculate their isSelected/isIndeterminate
   *              based on how many children are selected.
   *
   * The "indeterminate" state appears when some — but not all — children
   * of a parent are checked. This is the tri-state checkbox pattern
   * required by the assignment.
   */
  const toggleSelect = useCallback(
    (nodeId: string): void => {
      setRootNodes((previousRoots) => {
        // We need a full pass anyway for upward propagation,
        // so we clone the whole tree in one go.
        const clonedRoots = deepCloneTree(previousRoots);

        const targetNode = findNodeById(clonedRoots, nodeId);
        if (!targetNode) return previousRoots;

        const newSelectionState = !targetNode.isSelected;

        // Downward propagation — select/deselect all descendants.
        setSelectionDownward(targetNode, newSelectionState);

        // Upward propagation — recalculate indeterminate states
        // from leaves up to roots.
        recalculateIndeterminateStates(clonedRoots);

        return clonedRoots;
      });
    },
    [],
  );

  return { flatNodes, rootNodes, toggleExpand, toggleSelect };
}

// ──────────────────────────────────────────────────────────
// Helper functions (not exported — internal to this module)
// ──────────────────────────────────────────────────────────

/**
 * Creates a deep clone of the tree so we can mutate freely
 * without violating React's immutability contract.
 */
function deepCloneTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: deepCloneTree(node.children),
  }));
}

/**
 * Sets `isSelected` on a node and every descendant below it.
 * Also clears `isIndeterminate` since a fully-selected or
 * fully-deselected subtree has no mixed state.
 */
function setSelectionDownward(node: TreeNode, selected: boolean): void {
  node.isSelected = selected;
  node.isIndeterminate = false;

  for (const child of node.children) {
    setSelectionDownward(child, selected);
  }
}

/**
 * Walks the tree bottom-up (post-order) to set each parent's
 * isSelected and isIndeterminate based on its children's states.
 *
 * Logic for a parent with N children:
 *  - If all N children are selected → parent is selected, not indeterminate
 *  - If 0 children are selected and none are indeterminate → parent is deselected
 *  - Otherwise → parent is not selected, IS indeterminate
 *
 * Returns a tuple [selectedCount, totalCount] so the caller (parent)
 * can aggregate child results without re-traversing.
 */
function recalculateIndeterminateStates(
  nodes: TreeNode[],
): [number, number] {
  let selectedInGroup = 0;
  let totalInGroup = 0;

  for (const node of nodes) {
    if (node.children.length > 0) {
      const [childSelected, childTotal] =
        recalculateIndeterminateStates(node.children);

      const allChildrenSelected = childSelected === childTotal && childTotal > 0;
      const noChildSelected = childSelected === 0;
      // A child being indeterminate also makes the parent indeterminate.
      const anyChildIndeterminate = node.children.some(
        (child) => child.isIndeterminate,
      );

      if (allChildrenSelected) {
        node.isSelected = true;
        node.isIndeterminate = false;
      } else if (noChildSelected && !anyChildIndeterminate) {
        node.isSelected = false;
        node.isIndeterminate = false;
      } else {
        node.isSelected = false;
        node.isIndeterminate = true;
      }
    }

    totalInGroup++;
    if (node.isSelected) {
      selectedInGroup++;
    }
  }

  return [selectedInGroup, totalInGroup];
}
