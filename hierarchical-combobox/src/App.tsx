import { Combobox } from './components/Combobox/Combobox';

function App(): React.JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-50 p-xl">
      <h1 className="mb-lg text-2xl font-bold text-neutral-900">
        Hierarchical Combobox
      </h1>
      <Combobox />
    </main>
  );
}

export default App;

