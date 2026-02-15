import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';
import { createTreeNode } from '../../logic/tree-utils';
import type { TreeNode } from '../../types/tree';

/**
 * Storybook stories for the HierarchicalCombobox.
 *
 * Four stories cover the key scenarios:
 *  1. Default        – Small dataset (8 root departments, lazy-load children)
 *  2. LargeDataset   – 10,000 pre-loaded items to prove custom virtualization
 *  3. AsyncLoading   – Exaggerated network latency (2 seconds) per expand
 *  4. ErrorState     – Every expand triggers a simulated API failure
 */
const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story): React.JSX.Element => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

// ─────────────────────────────────────────────────
// Story 1: Default — Small data (8 root departments)
// ─────────────────────────────────────────────────

/**
 * Uses the built-in mock loader with 8 root departments.
 * Click any row to expand and lazy-load children after a 500ms delay.
 * This is the baseline interaction story.
 */
export const Default: Story = {};

// ─────────────────────────────────────────────────
// Story 2: LargeDataset — 10,000 items (proves virtualization)
// ─────────────────────────────────────────────────

/**
 * Generates a flat tree with 10,000 leaf nodes.
 *
 * This proves the custom virtualizer renders only the visible subset.
 * Open Chrome DevTools → Elements panel and count the rendered <div>
 * rows: you should see ~20–30 rows in the DOM, not 10,000.
 *
 * Generation strategy:
 *   200 root groups × 50 children each = 10,000 nodes.
 *   All children are pre-loaded and roots start expanded so the
 *   flat list is immediately 10,200 items (200 roots + 10,000 children).
 */
function generateLargeDataset(): TreeNode[] {
  const GROUP_COUNT = 200;
  const CHILDREN_PER_GROUP = 50;
  const roots: TreeNode[] = [];

  for (let g = 0; g < GROUP_COUNT; g++) {
    const root = createTreeNode(`group-${g}`, `Group ${g + 1}`, true);

    const children: TreeNode[] = [];
    for (let c = 0; c < CHILDREN_PER_GROUP; c++) {
      children.push(
        createTreeNode(`group-${g}-item-${c}`, `Group ${g + 1} › Item ${c + 1}`, false),
      );
    }

    // Pre-load children and set isOpen so they appear immediately
    root.children = children;
    root.isOpen = true;

    roots.push(root);
  }

  return roots;
}

/**
 * 10,200 visible rows (200 open groups × 50 children + 200 roots).
 * The dropdown should scroll smoothly with no jank — all rendering
 * is handled by the math-based virtualizer.
 */
export const LargeDataset: Story = {
  args: {
    initialRootNodes: generateLargeDataset(),
  },
};

// ─────────────────────────────────────────────────
// Story 3: AsyncLoading — Exaggerated network latency (2 seconds)
// ─────────────────────────────────────────────────

/**
 * A slower version of the default loader to make the loading skeleton
 * clearly visible during demos. The pulsing skeleton replaces the
 * expand chevron for 2 full seconds before children appear.
 *
 * @param parentId    The expanding node's id.
 * @param parentLabel Used for child label generation.
 */
function slowFetchChildren(parentId: string, parentLabel: string): Promise<TreeNode[]> {
  const SLOW_DELAY_MS = 2000;

  return new Promise<TreeNode[]>((resolve) => {
    setTimeout(() => {
      const childCount = 4 + Math.floor(Math.random() * 5);
      const children: TreeNode[] = [];

      for (let i = 0; i < childCount; i++) {
        children.push(
          createTreeNode(
            `${parentId}-${i}`,
            `${parentLabel} › Item ${i + 1}`,
            Math.random() > 0.5,
          ),
        );
      }

      resolve(children);
    }, SLOW_DELAY_MS);
  });
}

/**
 * Demonstrates loading state UX with a 2-second delay per expand.
 * Watch the skeleton animation while children load.
 */
export const AsyncLoading: Story = {
  args: {
    fetchChildrenFn: slowFetchChildren,
  },
};

// ─────────────────────────────────────────────────
// Story 4: ErrorState — Every expand triggers an API failure
// ─────────────────────────────────────────────────

/**
 * A fetch function that always rejects after a short delay.
 * This simulates a network failure or server error.
 * The combobox should display an error banner in the dropdown
 * and revert the loading state on the expanded node.
 */
function failingFetchChildren(
  parentId: string,
  parentLabel: string,
): Promise<TreeNode[]> {
  // Parameters consumed to satisfy the function signature
  void parentId;
  void parentLabel;

  const FAIL_DELAY_MS = 800;

  return new Promise<TreeNode[]>((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Network error: unable to load children. Please try again.'));
    }, FAIL_DELAY_MS);
  });
}

/**
 * Every expand attempt fails with an error banner.
 * The dismiss button clears the error, and you can retry.
 */
export const ErrorState: Story = {
  args: {
    fetchChildrenFn: failingFetchChildren,
  },
};
