import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Card = forwardRef(
  ({ className, children, padding = "default", ...props }, ref) => {
    const paddingVariants = {
      none: "",
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-slate-200 bg-white shadow-sm",
          paddingVariants[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
