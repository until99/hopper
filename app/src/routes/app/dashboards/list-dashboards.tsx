import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Main } from '../../../components/layout/main'
import { Header } from '../../../components/layout/header'
import { Input } from '../../../components/ui/Input'
import { DashboardCategoryGroup } from '../../../components/ui/dashboard-category-group'
import { useDashboards } from '../../../hooks/useDashboards'
import { type Dashboard } from '../../../interfaces/dashboard'

export const Route = createFileRoute('/app/dashboards/list-dashboards')({
  component: RouteComponent,
})

function RouteComponent() {
  const { dashboards, loading, error } = useDashboards()
  const [searchTerm, setSearchTerm] = useState('')

  // Filtra dashboards baseado no termo de busca
  const filteredDashboards = useMemo(() => {
    if (!searchTerm.trim()) return dashboards

    const term = searchTerm.toLowerCase()
    return dashboards.filter(dashboard =>
      dashboard.title.toLowerCase().includes(term) ||
      dashboard.description.toLowerCase().includes(term) ||
      dashboard.category.toLowerCase().includes(term) ||
      dashboard.workspace.toLowerCase().includes(term)
    )
  }, [dashboards, searchTerm])

  // Agrupa dashboards por categoria
  const dashboardsByCategory = useMemo(() => {
    const groups: Record<string, { dashboards: Dashboard[]; workspace: string }> = {}

    filteredDashboards.forEach(dashboard => {
      const category = dashboard.category || 'Not Categorized'
      if (!groups[category]) {
        groups[category] = {
          dashboards: [],
          workspace: dashboard.workspace
        }
      }
      groups[category].dashboards.push(dashboard)
    })

    return groups
  }, [filteredDashboards])

  const totalDashboards = filteredDashboards.length

  if (loading) {
    return (
      <Main.Root>
        <Main.Aside />
        <Main.Body>
          <Header.Root
            title="Dashboards"
            subtitle="Loading dashboards..."
          />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Main.Body>
      </Main.Root>
    )
  }

  if (error) {
    return (
      <Main.Root>
        <Main.Aside />
        <Main.Body>
          <Header.Root
            title="Dashboards"
            subtitle="Error loading dashboards"
          />
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </Main.Body>
      </Main.Root>
    )
  }

  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <Header.Root
          title="Dashboards"
          subtitle={`Select a dashboard to view (${totalDashboards})`}
        />

        <div className="space-y-6 p-4">
          {/* Barra de busca */}
          <div className="max-w-lg">
            <Input.Root>
              <Input.Icon icon="🔍" />
              <Input.Field
                id="search-dashboards"
                type="text"
                placeholder="Search dashboards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Input.Root>
          </div>

          {/* Lista de dashboards agrupados por categoria */}
          {Object.entries(dashboardsByCategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No dashboards found</p>
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(dashboardsByCategory).map(([category, { dashboards: categoryDashboards, workspace }]) => (
                <DashboardCategoryGroup.Root key={category}>
                  <DashboardCategoryGroup.Header>
                    <DashboardCategoryGroup.Title count={categoryDashboards.length}>
                      {category}
                    </DashboardCategoryGroup.Title>
                    <DashboardCategoryGroup.Workspace workspace={workspace} />
                  </DashboardCategoryGroup.Header>

                  <DashboardCategoryGroup.Grid>
                    {categoryDashboards.map((dashboard) => (
                      <DashboardCategoryGroup.Item
                        key={dashboard.dashboardId}
                        dashboard={dashboard}
                        className="transform transition-transform duration-200 hover:scale-[1.02]"
                      />
                    ))}
                  </DashboardCategoryGroup.Grid>
                </DashboardCategoryGroup.Root>
              ))}
            </div>
          )}
        </div>
      </Main.Body>
    </Main.Root>
  )
}
