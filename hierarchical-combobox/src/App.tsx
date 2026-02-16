import { Combobox } from './components/Combobox/Combobox';

function App(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      {/* Demo card */}
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">
            Hierarchical Combobox
          </h1>
          <p className="text-sm text-gray-600">
            Type to search or click to browse the hierarchical tree. Use keyboard navigation (↑↓ arrows, Enter to select, → to expand).
          </p>
        </div>

        {/* The component */}
        <Combobox />
      </div>
    </main>
  );
}

export default App;

