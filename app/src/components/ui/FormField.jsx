import { cn } from "../../lib/utils";

const FormField = ({
  label,
  error,
  required = false,
  children,
  htmlFor,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-slate-900"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
