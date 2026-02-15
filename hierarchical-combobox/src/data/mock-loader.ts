import type { TreeNode } from '../types/tree';
import { createTreeNode } from '../logic/tree-utils';

/**
 * Simulated network delay in milliseconds.
 * Mimics a real API round-trip so we can test loading states,
 * skeleton indicators, and error recovery in development.
 */
const SIMULATED_LATENCY_MS = 500;

/**
 * Generates a batch of child nodes for a given parent.
 *
 * In a real app this would be a fetch() call to something like
 *   GET /api/tree/{parentId}/children
 *
 * The mock creates 4–8 children per parent. Roughly half of them
 * are marked as `hasChildren: true` so we get a realistic mix of
 * expandable branches and leaf nodes.
 *
 * Naming follows "ParentLabel > Child N" so it's easy to trace
 * ancestry visually during debugging.
 */
function generateMockChildren(
  parentId: string,
  parentLabel: string,
): TreeNode[] {
  // Between 4 and 8 children — enough to test scrolling without being absurd.
  const childCount = 4 + Math.floor(Math.random() * 5);
  const generatedChildren: TreeNode[] = [];

  for (let i = 0; i < childCount; i++) {
    const childId = `${parentId}-${i}`;
    const childLabel = `${parentLabel} › Item ${i + 1}`;
    // ~50% of nodes are branches, rest are leaves
    const isBranch = Math.random() > 0.5;

    generatedChildren.push(createTreeNode(childId, childLabel, isBranch));
  }

  return generatedChildren;
}

/**
 * Fetches children of a given parent node after a simulated delay.
 *
 * Returns a Promise that resolves with an array of TreeNode children.
 * The 500ms delay lets us verify that:
 *   - The loading spinner appears during the wait
 *   - The UI doesn't flicker on fast connections (intentional floor)
 *   - Keyboard focus isn't lost while content loads
 *
 * @param parentId     The id of the node being expanded.
 * @param parentLabel  Used to generate readable child labels.
 */
export function fetchChildren(
  parentId: string,
  parentLabel: string,
): Promise<TreeNode[]> {
  return new Promise<TreeNode[]>((resolve) => {
    setTimeout(() => {
      const children = generateMockChildren(parentId, parentLabel);
      resolve(children);
    }, SIMULATED_LATENCY_MS);
  });
}

/**
 * Creates the initial top-level tree data.
 * These are the root nodes visible when the combobox first opens.
 */
export function generateRootNodes(): TreeNode[] {
  const rootLabels = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'Human Resources',
  ];

  return rootLabels.map((label, index) =>
    createTreeNode(`root-${index}`, label, true),
  );
}
