import type { TreeNode, FlatNode } from '../types/tree';

/**
 * Flattens a nested tree into a 1D array of visible nodes.
 *
 * Why flatten?
 * ────────────
 * A nested tree rendered as recursive <ul> elements can't be virtualized
 * because the browser owns the layout of every nested level. To virtualize,
 * we need a single flat list where each item is positioned by index math:
 *
 *   rowTopOffset = index * ROW_HEIGHT
 *
 * So we walk the tree depth-first and collect every node that is currently
 * "visible" — meaning all of its ancestors are expanded (isOpen = true).
 * Collapsed branches are skipped entirely, which keeps the array lean.
 *
 * Depth tracking
 * ──────────────
 * Each FlatNode carries a `depth` number (root = 0, first child = 1, etc.)
 * so the renderer can indent rows with something like:
 *
 *   paddingLeft = depth * INDENT_PX
 *
 * Performance note
 * ────────────────
 * This function is pure — same input always produces the same output — so
 * it plays nicely with React.useMemo. We avoid creating closures or binding
 * inside the loop to keep GC pressure low on large trees (10k+ nodes).
 *
 * @param rootNodes  The top-level nodes of the tree.
 * @returns          A flat array of { node, depth } objects for every visible node.
 */
export function flattenTree(rootNodes: TreeNode[]): FlatNode[] {
  const flatList: FlatNode[] = [];

  /**
   * Iterative depth-first traversal using an explicit stack.
   *
   * We push children in reverse order so the first child gets popped
   * (and therefore processed) first — preserving the natural top-down
   * reading order users expect.
   *
   * Stack entry: [node, depthLevel]
   */
  const traversalStack: Array<[TreeNode, number]> = [];

  // Seed the stack with root nodes in reverse so index-0 is processed first.
  for (let rootIndex = rootNodes.length - 1; rootIndex >= 0; rootIndex--) {
    const rootNode = rootNodes[rootIndex];
    if (rootNode) {
      traversalStack.push([rootNode, 0]);
    }
  }

  while (traversalStack.length > 0) {
    const stackEntry = traversalStack.pop();
    if (!stackEntry) break;

    const [currentNode, depthLevel] = stackEntry;

    flatList.push({ node: currentNode, depth: depthLevel });

    // Only descend into children if this node is expanded.
    // Collapsed nodes still appear in the list — their children don't.
    if (currentNode.isOpen && currentNode.children.length > 0) {
      // Push children in reverse so the first child is on top of the stack.
      for (
        let childIndex = currentNode.children.length - 1;
        childIndex >= 0;
        childIndex--
      ) {
        const childNode = currentNode.children[childIndex];
        if (childNode) {
          traversalStack.push([childNode, depthLevel + 1]);
        }
      }
    }
  }

  return flatList;
}

/**
 * Finds a node by ID anywhere in the tree. Returns null if not found.
 *
 * Uses the same iterative DFS approach as flattenTree to avoid
 * call-stack overflow on deeply nested datasets.
 */
export function findNodeById(
  rootNodes: TreeNode[],
  targetId: string,
): TreeNode | null {
  const searchStack: TreeNode[] = [...rootNodes];

  while (searchStack.length > 0) {
    const currentNode = searchStack.pop();
    if (!currentNode) continue;

    if (currentNode.id === targetId) {
      return currentNode;
    }

    for (let i = currentNode.children.length - 1; i >= 0; i--) {
      const child = currentNode.children[i];
      if (child) {
        searchStack.push(child);
      }
    }
  }

  return null;
}

/**
 * Creates a fresh TreeNode with sensible defaults.
 * Keeps node creation consistent across the codebase.
 */
export function createTreeNode(
  id: string,
  label: string,
  hasChildren: boolean = false,
): TreeNode {
  return {
    id,
    label,
    children: [],
    isOpen: false,
    isSelected: false,
    isIndeterminate: false,
    isLoading: false,
    hasChildren,
  };
}
