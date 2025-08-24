import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Checkbox = forwardRef(
  ({ className, label, description, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500",
              error && "border-red-300 focus:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-2 text-sm">
            {label && (
              <label className="font-medium text-gray-700">{label}</label>
            )}
            {description && <p className="text-gray-500">{description}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
