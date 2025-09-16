import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Main } from '../../../components/layout/main'
import { DashboardControls } from '../../../components/ui/dashboard-controls'
import { useDashboards } from '../../../hooks/useDashboards'
import { type Dashboard } from '../../../interfaces/dashboard'

export const Route = createFileRoute('/app/dashboards/$dashboardId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { dashboardId } = Route.useParams()
  const navigate = useNavigate()
  const { dashboards, loading } = useDashboards()
  
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (dashboards.length > 0) {
      const foundDashboard = dashboards.find(d => d.dashboardId === dashboardId)
      setDashboard(foundDashboard || null)
    }
  }, [dashboards, dashboardId])

  const handleBack = () => {
    navigate({ to: '/app/dashboards/list-dashboards' })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simula refresh do Power BI
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExport = () => {
    // Simula export do dashboard
    console.log('Exporting dashboard:', dashboardId)
    alert('Export functionality would be implemented here')
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      // Entrar em fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
    } else {
      // Sair do fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleShare = () => {
    // Simula compartilhamento do dashboard
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('Dashboard link copied to clipboard!')
    }).catch(() => {
      prompt('Copy this link:', url)
    })
  }

  if (loading) {
    return (
      <Main.Root>
        <Main.Aside />
        <Main.Body>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Main.Body>
      </Main.Root>
    )
  }

  if (!dashboard) {
    return (
      <Main.Root>
        <Main.Aside />
        <Main.Body>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Dashboard not found</p>
            <button 
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Dashboards
            </button>
          </div>
        </Main.Body>
      </Main.Root>
    )
  }

  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        {/* Header com controles */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DashboardControls.BackButton onBack={handleBack} />
              <DashboardControls.Title 
                title={dashboard.title}
                description={dashboard.description}
              />
            </div>
            
            <DashboardControls.Root>
              <DashboardControls.RefreshButton 
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
              <DashboardControls.ExportButton onExport={handleExport} />
              <DashboardControls.FullscreenButton 
                onFullscreen={handleFullscreen}
                isFullscreen={isFullscreen}
              />
              <DashboardControls.ShareButton onShare={handleShare} />
            </DashboardControls.Root>
          </div>
        </div>

        {/* Container do Power BI */}
        <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-6xl">📊</span>
            </div>
            <h2 className="text-xl font-semibold text-yellow-600 mb-2">Power BI</h2>
            <p className="text-gray-600 mb-4">Sign in to view this report</p>
            <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">
              Sign in
            </button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-700">Category:</span>
            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              dashboard.categoryColor === 'blue' ? 'bg-blue-100 text-blue-800' :
              dashboard.categoryColor === 'green' ? 'bg-green-100 text-green-800' :
              dashboard.categoryColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
              dashboard.categoryColor === 'violet' ? 'bg-violet-100 text-violet-800' :
              dashboard.categoryColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {dashboard.category}
            </span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-700">Workspace:</span>
            <span className="ml-2 text-gray-600">{dashboard.workspace}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-700">Dashboard ID:</span>
            <span className="ml-2 text-gray-600 font-mono text-xs">{dashboard.dashboardId}</span>
          </div>
        </div>
      </Main.Body>
    </Main.Root>
  )
}
