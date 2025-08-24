import SearchInput from "../../../components/ui/SearchInput";

const DashboardHeader = ({
  searchQuery,
  onSearchChange,
  resultsCount = 0,
  totalCount = 0,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
          <h2 className="text-md text-gray-500">
            Select a dashboard to view
            {totalCount > 0 && (
              <span className="ml-2">
                {searchQuery
                  ? `(${resultsCount} of ${totalCount})`
                  : `(${totalCount})`}
              </span>
            )}
          </h2>
        </div>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search dashboards... (Use :des=text for description, :cat=text for category, :ws=text for workspace)"
        className="w-full"
      />
    </div>
  );
};

export default DashboardHeader;
