# Hierarchical Combobox

A production-ready, accessible hierarchical selection component with async data loading, virtualization, and multi-select support. Built from scratch with React 19, TypeScript, and Tailwind CSS.

## ⚡ Features

- **Async Tree Loading** - Lazy-load children on expand with loading states
- **Virtualized Rendering** - Custom virtualizer handles 10,000+ items smoothly
- **Search with Ancestry** - Filter tree with breadcrumb context preservation
- **Multi-Select** - Cascading selection with indeterminate parent states
- **Keyboard-First UX** - Full keyboard navigation (ARIA 1.2 compliant)
- **Accessible** - Screen reader support, focus management, WCAG 2.1 AA
- **Error Handling** - Graceful async error recovery with user feedback

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Run tests
npm run test

# Run Storybook
npm run storybook

# Build for production
npm run build
```

## 📖 API Documentation

### Component: `<Combobox />`

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `initialRootNodes` | `TreeNode[]` | No | 8 departments | Override the initial root-level nodes |
| `fetchChildrenFn` | `(parentId: string, parentLabel: string) => Promise<TreeNode[]>` | No | Mock loader (500ms delay) | Override the async child-fetch function |

#### Example Usage

```typescript
import { Combobox } from './components/Combobox/Combobox';

function App() {
  return <Combobox />;
}
```

#### Custom Data Loader

```typescript
<Combobox
  initialRootNodes={myRootNodes}
  fetchChildrenFn={async (parentId, parentLabel) => {
    const response = await fetch(`/api/tree/${parentId}/children`);
    return response.json();
  }}
/>
```

### Data Types

#### `TreeNode`

```typescript
interface TreeNode {
  id: string;              // Unique node identifier
  label: string;           // Display text
  hasChildren: boolean;    // Whether node has expandable children
  isOpen: boolean;         // Expansion state
  isSelected: boolean;     // Selection state
  isIndeterminate: boolean; // Partial selection (some children selected)
  isLoading: boolean;      // Children currently loading
  children: TreeNode[];    // Child nodes
}
```

#### `FlatNode`

```typescript
interface FlatNode {
  node: TreeNode;          // The tree node data
  depth: number;           // Nesting level (0 = root)
  breadcrumb?: string;     // Ancestry path for search results
}
```

## 🎨 Storybook

The component includes 7 comprehensive Storybook stories:

1. **Default** - Small dataset demo (8 root departments)
2. **LargeDataset** - 10,000 items proving virtualization works
3. **AsyncLoading** - Exaggerated 2-second loading delay
4. **ErrorState** - Simulated API failures
5. **HighContrast** - Accessibility verification in high-contrast mode
6. **KeyboardOnly** - Full keyboard navigation demo
7. **SearchFiltering** - Pre-loaded tree for search testing

```bash
npm run storybook
# Open http://localhost:6006
```

## ♿ Accessibility

Fully WCAG 2.1 AA compliant. See [ACCESSIBILITY-REPORT.md](./ACCESSIBILITY-REPORT.md) for details.

### Keyboard Navigation

- `↓` / `↑` - Navigate options
- `→` / `←` - Expand/collapse nodes
- `Enter` - Toggle selection
- `Home` / `End` - Jump to first/last
- `Esc` - Close dropdown
- Type to search

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

**Test Coverage:**
- 17 integration tests
- Keyboard navigation
- ARIA attribute validation
- Multi-select logic
- Search functionality
- Error handling

## 🏗️ Architecture

### Custom Virtualization

The virtualizer renders only visible rows based on scroll position:

```
totalHeight = itemCount × itemHeight
startIndex = floor(scrollTop / itemHeight) - overscan
endIndex = startIndex + visibleCount + overscan
```

No libraries used - pure math-based implementation.

### State Management

All state managed via custom React hooks:

- `useTreeData` - Tree structure, selection, async loading
- `useVirtualizer` - Scroll-based viewport calculations
- No external state libraries (Redux, Zustand, etc.)

### File Structure

```
src/
├── components/
│   └── Combobox/
│       ├── Combobox.tsx          # Main component
│       ├── TreeRow.tsx           # Individual row renderer
│       ├── SelectedTags.tsx      # Tag pills display
│       ├── Combobox.stories.tsx  # Storybook stories
│       └── Combobox.test.tsx     # Integration tests
├── hooks/
│   ├── useTreeData.ts            # Tree state management
│   └── useVirtualizer.ts         # Scroll-based virtualization
├── logic/
│   └── tree-utils.ts             # Pure functions (flatten, search, etc.)
├── types/
│   └── tree.ts                   # TypeScript interfaces
└── data/
    └── mock-loader.ts            # Simulated async API
```

## 🛠️ Tech Stack

- **React** 19.2.0
- **TypeScript** 5.9.3 (strict mode)
- **Vite** 7.3.1
- **Tailwind CSS** 3.x
- **Storybook** 8.6.15
- **Vitest** 4.0.18
- **Testing Library** 16.3.2

**No component libraries.** All UI, state, and virtualization logic built from scratch.

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Build Storybook
npm run build-storybook

# Preview production build
npm run preview
```

Deploy to Vercel:
1. Push to GitHub
2. Import project on Vercel
3. Build command: `npm run build`
4. Output directory: `dist`

Deploy Storybook to Chromatic:
```bash
npx chromatic --project-token=<YOUR_TOKEN>
```

## 📄 License

MIT

## 🤝 Contributing

This is an assignment project. Contributions are not accepted.
