interface ExampleQueryButtonProps {
  exampleQuery: string
  setQuery: (query: string) => void
}

const ExampleQueryButton: React.FC<ExampleQueryButtonProps> = ({
  exampleQuery,
  setQuery,
}) => (
  <button
    type="button"
    className="m-1 rounded border
    border-slate-200 bg-slate-50
    px-1.5 py-1
    transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-gray-500
    dark:hover:bg-gray-600"
    onClick={() => {
      setQuery(exampleQuery)
    }}
  >
    {exampleQuery}
  </button>
)
ExampleQueryButton.displayName = "ExampleQueryButton"

export { ExampleQueryButton }
