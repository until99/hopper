import { useEffect, useState } from "react";

export default function Home() {

  interface QueryResult {
    columns: string[];
    rows: Array<{ [key: string]: any }>;
    total: number;
  }

  const [QueryResults, setData] = useState<QueryResult | null>(null);

  useEffect(() => {
    fetch('http://localhost:6969/inventories')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <main className="p-5 flex flex-col h-screen gap-8">
        {/* <Textarea /> */}
        <textarea placeholder="SQL Query" className="w-full h-64 p-2 border border-gray-300 rounded mt-4"></textarea>

        {/* <Button /> */}
        <div className="w-fit flex items-center justify-between px-8 py-2 gap-4 bg-green rounded-lg hover:cursor-pointer bg-blue-600 hover:bg-blue-700">
          <button className="text-white font-semibold hover:cursor-pointer">Execute</button>
        </div>

        {/* <TableWithQueryResult /> */}
        <div className="rounded-lg bg-white overflow-hidden">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {QueryResults?.columns.map((column: string) => (
                  <th
                    key={column}
                    className="text-left p-3 text-sm font-semibold uppercase tracking-wide"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QueryResults?.rows.map((row: any, index: number) => (
                <tr
                  key={index}
                  className={`border-b border-gray-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
                >
                  {QueryResults.columns.map((column: string) => (
                    <td key={column} className="p-3 text-sm text-gray-700">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 text-sm text-gray-500">
            {QueryResults && QueryResults.total} rows returned
          </div>
        </div>
      </main >
    </>
  );
}