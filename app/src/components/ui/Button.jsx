import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Button = forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500",
      outline:
        "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-500",
      ghost: "text-slate-900 hover:bg-slate-100 focus:ring-slate-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      default: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
