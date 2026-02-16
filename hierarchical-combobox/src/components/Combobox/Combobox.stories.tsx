import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';
import { createTreeNode } from '../../logic/tree-utils';
import type { TreeNode } from '../../types/tree';

/**
 * Storybook stories for the HierarchicalCombobox.
 *
 * Seven stories cover the key scenarios:
 *  1. Default        – Small dataset (8 root departments, lazy-load children)
 *  2. LargeDataset   – 10,000 pre-loaded items to prove custom virtualization
 *  3. AsyncLoading   – Exaggerated network latency (2 seconds) per expand
 *  4. ErrorState     – Every expand triggers a simulated API failure
 *  5. HighContrast   – Verifies readability in forced-colors / high-contrast mode
 *  6. KeyboardOnly   – Opens with focus so keyboard-only usage can be demoed
 *  7. SearchFiltering – Pre-loaded tree to demonstrate search with ancestry context
 */
const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story): React.JSX.Element => (
      <div className="w-[480px]">
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

// ─────────────────────────────────────────────────
// Story 5: HighContrast — Forces high-contrast styles for a11y audit
// ─────────────────────────────────────────────────

/**
 * Renders the default combobox inside a wrapper that simulates
 * forced-colors / high-contrast media. The Accessibility panel
 * (powered by @storybook/addon-a11y) should report zero violations.
 *
 * Manual check: borders, focus rings, and text should remain visible
 * against both light and dark system backgrounds.
 */
export const HighContrast: Story = {
  decorators: [
    (Story): React.JSX.Element => (
      <div
        className="w-[480px] rounded-lg border-2 border-neutral-900 bg-white p-lg"
        style={{ forcedColorAdjust: 'auto' }}
      >
        <p className="mb-sm text-xs font-semibold uppercase tracking-wide text-neutral-500">
          High-contrast mode preview
        </p>
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};

// ─────────────────────────────────────────────────
// Story 6: KeyboardOnly — Demonstrates full keyboard navigation
// ─────────────────────────────────────────────────

/**
 * Instructions are displayed above the combobox so a reviewer can
 * verify every keyboard shortcut without needing a mouse.
 *
 * The story itself is identical to Default — the value is in the
 * instructions that guide the tester through the keyboard flow.
 */
export const KeyboardOnly: Story = {
  decorators: [
    (Story): React.JSX.Element => (
      <div className="w-[480px]">
        <div className="mb-md rounded-lg bg-primary-50 p-md text-xs leading-relaxed text-primary-800">
          <p className="mb-xs font-semibold">Keyboard-only test instructions:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Tab</kbd> to focus the input</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">↓</kbd> opens dropdown &amp; moves highlight down</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">↑</kbd> moves highlight up</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">→</kbd> expands a collapsed branch</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">←</kbd> collapses an expanded branch</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Enter</kbd> toggles selection on highlighted row</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Home</kbd> / <kbd className="rounded bg-primary-100 px-1 font-mono">End</kbd> jump to first / last row</li>
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Esc</kbd> clears search → closes dropdown</li>
            <li>Type to search; results show ancestry breadcrumbs</li>
          </ul>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ─────────────────────────────────────────────────
// Story 7: SearchFiltering — Pre-loaded tree for search demo
// ─────────────────────────────────────────────────

/**
 * Builds a deterministic 3-level tree so the search feature can be
 * demonstrated with predictable results and visible breadcrumbs.
 */
function generateSearchableTree(): TreeNode[] {
  const departments = ['Engineering', 'Design', 'Product'];
  const roots: TreeNode[] = [];

  for (let d = 0; d < departments.length; d++) {
    const deptLabel = departments[d] ?? `Dept ${d}`;
    const dept = createTreeNode(`dept-${d}`, deptLabel, true);
    dept.isOpen = true;

    const teams = ['Frontend', 'Backend', 'Infrastructure'];
    const children: TreeNode[] = [];

    for (let t = 0; t < teams.length; t++) {
      const teamLabel = teams[t] ?? `Team ${t}`;
      const team = createTreeNode(`dept-${d}-team-${t}`, teamLabel, true);
      team.isOpen = true;

      const members: TreeNode[] = [];
      for (let m = 0; m < 4; m++) {
        members.push(
          createTreeNode(
            `dept-${d}-team-${t}-member-${m}`,
            `${teamLabel} Member ${m + 1}`,
            false,
          ),
        );
      }
      team.children = members;
      children.push(team);
    }

    dept.children = children;
    roots.push(dept);
  }

  return roots;
}

/**
 * A pre-loaded 3-level tree for testing search with ancestry context.
 * Type "Frontend" to see it matched under every department with breadcrumbs.
 * Type "Member" to see leaf nodes with full ancestry paths.
 */
export const SearchFiltering: Story = {
  args: {
    initialRootNodes: generateSearchableTree(),
  },
};
