type Dashboard = {
  id: number
  dashboardName: string
  workspace: string
  group: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
  createdBy: string
  status: string
  type: "dashboard" | "report"
  lastAccessed: string
  lastModified: string
  lastModifiedById: number
  isFavorite: boolean
}

export default Dashboard;