import { useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import WorkspaceGroup from "./WorkspaceGroup";
import EmptyState from "./EmptyState";
import useDashboardFilters from "../hooks/useDashboardFilters";
import useDashboards from "../../../hooks/useDashboards";
import { Button } from "../../../components/ui";

const DashboardList = ({ dashboards: propDashboards }) => {
  // Use API hook if no dashboards prop is provided
  const apiDashboards = useDashboards();
  const shouldUseApi = !propDashboards;

  // Use either API dashboards or prop dashboards
  const dashboards = shouldUseApi ? apiDashboards.dashboards : propDashboards;
  const isLoading = shouldUseApi ? apiDashboards.loading : false;
  const error = shouldUseApi ? apiDashboards.error : null;

  const {
    searchQuery,
    setSearchQuery,
    groupedDashboards,
    toggleWorkspaceCollapse,
    isWorkspaceCollapsed,
    clearSearch,
    hasResults,
  } = useDashboardFilters(dashboards);

  // Handle page reload after authentication
  useEffect(() => {
    const currentPath = window.location.pathname;
    const previousPath = document.referrer;

    if (
      previousPath.includes("/auth/login") ||
      previousPath.includes("/auth/register")
    ) {
      if (!sessionStorage.getItem("pageReloaded")) {
        sessionStorage.setItem("pageReloaded", "true");
        window.location.reload();
      }
    }
  }, []);

  const totalDashboards = dashboards.length;
  const filteredCount = Object.values(groupedDashboards).reduce(
    (acc, workspaceDashboards) => acc + workspaceDashboards.length,
    0,
  );

  // Handle refresh for API dashboards
  const handleRefresh = () => {
    if (shouldUseApi && apiDashboards.refetch) {
      apiDashboards.refetch();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="p-4">
        <DashboardHeader
          searchQuery=""
          onSearchChange={() => {}}
          resultsCount={0}
          totalCount={0}
        />
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-600">Carregando painéis...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="p-4">
        <DashboardHeader
          searchQuery=""
          onSearchChange={() => {}}
          resultsCount={0}
          totalCount={0}
        />
        <div className="mt-6">
          <EmptyState
            title="Erro ao carregar painéis"
            description={error}
            showClearButton={false}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleRefresh} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredCount}
        totalCount={totalDashboards}
      />

      <div className="mt-6 space-y-5">
        {!hasResults ? (
          <EmptyState
            title={
              searchQuery
                ? "Nenhum painel encontrado"
                : "Nenhum painel disponível"
            }
            description={
              searchQuery
                ? "Nenhum painel encontrado com os critérios de busca."
                : shouldUseApi
                  ? "Não há painéis disponíveis na API no momento."
                  : "Não há painéis disponíveis no momento."
            }
            showClearButton={!!searchQuery}
            onClear={clearSearch}
          />
        ) : (
          Object.entries(groupedDashboards).map(
            ([workspace, workspaceDashboards]) => (
              <WorkspaceGroup
                key={workspace}
                workspace={workspace}
                dashboards={workspaceDashboards}
                isCollapsed={isWorkspaceCollapsed(workspace)}
                onToggleCollapse={toggleWorkspaceCollapse}
              />
            ),
          )
        )}
        {shouldUseApi && dashboards.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-500">
            Dados carregados da API • {new Date().toLocaleTimeString()}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="ml-2"
            >
              Atualizar
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardList;
