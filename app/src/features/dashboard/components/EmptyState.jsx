import Button from "../../../components/ui/Button";

const EmptyState = ({
  title = "No dashboards found",
  description = "No dashboards found matching your search.",
  showClearButton = false,
  onClear,
}) => {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-8 w-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mb-6 text-slate-500">{description}</p>

        {showClearButton && onClear && (
          <Button variant="outline" onClick={onClear}>
            Clear search
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
