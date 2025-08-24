import { cn } from "../../lib/utils";
import { Card } from "./index";

const DataTable = ({
  columns,
  data,
  className,
  emptyMessage = "No data available",
  onRowAction,
}) => {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="cursor-pointer p-3 text-left text-sm font-medium text-slate-500"
                >
                  <div className="flex items-center">{column.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-sm text-black">
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataTable;
