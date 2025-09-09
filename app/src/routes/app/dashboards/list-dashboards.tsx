import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../components/layout/main'
import { useDashboards } from '../../../hooks/useDashboards'

export const Route = createFileRoute('/app/dashboards/list-dashboards')({
  component: RouteComponent,
})

function RouteComponent() {
  const { dashboards, loading, error } = useDashboards()

  if (loading) return <div>Loading dashboards...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>List Dashboards</h1>
        <div className="grid gap-4">
          {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{dashboard.title}</h3>
              <p className="text-gray-600">{dashboard.description}</p>
              <div className="mt-2">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                  Workspace: {dashboard.workspace}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ID: {dashboard.workspaceId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Main.Body>
    </Main.Root>
  )
}
