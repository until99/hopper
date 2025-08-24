import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  (
    {
      className,
      type = "text",
      icon: Icon,
      rightIcon: RightIcon,
      error,
      ...props
    },
    ref,
  ) => {
    const hasIcon = Icon || RightIcon;

    return (
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
            size={18}
          />
        )}

        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm transition-colors placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed",
            Icon && "pl-10",
            RightIcon && "pr-10",
            error &&
              "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />

        {RightIcon && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            <RightIcon />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
