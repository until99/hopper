import { useState } from "react";

async function fetchQueryResults(query: string): Promise<any> {
  const response = await fetch("http://localhost:6969/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error("Failed to fetch query results");
  }
  return response.json();
}

interface QueryResult {
  columns: string[];
  rows: Array<{ [key: string]: any }>;
  total: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const totalPages = queryResults ? Math.ceil(queryResults.total / rowsPerPage) : 0;

  const handleExecute = async () => {
    console.log("Executing query:", query);
    setLoading(true);
    setError(null);
    try {
      const result = await fetchQueryResults(query);
      console.log("Query result:", result);
      setQueryResults(result);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Query error:", err);
      setError(err.message || "Unknown error");
      setQueryResults(null);
    } finally {
      console.log("Execution complete");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="p-5 flex flex-col gap-8">
        <textarea
          placeholder="SQL Query"
          className="w-full h-64 p-2 border border-gray-300 rounded mt-4"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div
          className="w-fit flex items-center justify-between px-8 py-2 gap-4 bg-green rounded-lg hover:cursor-pointer bg-blue-600 hover:bg-blue-700"
        >
          <button
            className="text-white font-semibold hover:cursor-pointer"
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? "Executing..." : "Execute"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 p-2">{error}</div>
        )}

        <div className="rounded-lg bg-white overflow-hidden">
          {queryResults && (
            <>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {queryResults.columns.map((column: string) => (
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
                  {queryResults.rows
                    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                    .map((row: any, index: number) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
                      >
                        {queryResults.columns.map((column: string) => (
                          <td key={column} className="p-3 text-sm text-gray-700">
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="p-3 text-sm text-gray-500">
                {queryResults.total} rows returned
              </div>
              {/* Pagination controls */}
              <div className="flex items-center justify-between p-3">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}