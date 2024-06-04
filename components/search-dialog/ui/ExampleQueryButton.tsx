interface ExampleQueryButtonProps {
  exampleQuery: string;
    setQuery: (query: string) => void;
}

const ExampleQueryButton: React.FC<ExampleQueryButtonProps> = ({ exampleQuery, setQuery }) => (
  <button
    type="button"
    className="px-1.5 py-1 m-1
    bg-slate-50 dark:bg-gray-500
    hover:bg-slate-100 dark:hover:bg-gray-600
    rounded border border-slate-200 dark:border-slate-600
    transition-colors"
    onClick={() => {
      setQuery(exampleQuery);
    }}
  >
    {exampleQuery}
  </button>
);
ExampleQueryButton.displayName = 'ExampleQueryButton';

export { ExampleQueryButton };