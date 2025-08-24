import { cn } from "../../lib/utils";

const PageHeader = ({ title, subtitle, children, className }) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <h2 className="text-md text-gray-500">{subtitle}</h2>}
      </div>
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
};

export default PageHeader;
