import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Select = forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;
