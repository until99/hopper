import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Toggle = forwardRef(
  (
    { className, checked, onChange, disabled, label, description, ...props },
    ref,
  ) => {
    return (
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div>
            {label && (
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "peer relative h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 peer-focus:outline-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white",
              className,
            )}
          />
        </label>
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
