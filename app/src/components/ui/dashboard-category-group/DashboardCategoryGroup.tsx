import { type Dashboard } from '../../../interfaces/dashboard'
import { DashboardCard } from '../dashboard-card'

interface DashboardCategoryGroupRootProps {
    children: React.ReactNode
    className?: string
}

function DashboardCategoryGroupRoot({ children, className = '' }: DashboardCategoryGroupRootProps) {
    return (
        <div className={`mb-8 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCategoryGroupHeaderProps {
    children: React.ReactNode
    className?: string
}

function DashboardCategoryGroupHeader({ children, className = '' }: DashboardCategoryGroupHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCategoryGroupTitleProps {
    children: React.ReactNode
    count?: number
    className?: string
}

function DashboardCategoryGroupTitle({ children, count, className = '' }: DashboardCategoryGroupTitleProps) {
    return (
        <div className={`flex items-center ${className}`}>
            <button className="flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700">
                <span className="mr-2">▼</span>
                {children}
                {count !== undefined && (
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                        {count} dashboard{count !== 1 ? 's' : ''}
                    </span>
                )}
            </button>
        </div>
    )
}

interface DashboardCategoryGroupWorkspaceProps {
    workspace: string
    className?: string
}

function DashboardCategoryGroupWorkspace({ workspace, className = '' }: DashboardCategoryGroupWorkspaceProps) {
    return (
        <span className={`text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded ${className}`}>
            {workspace}
        </span>
    )
}

interface DashboardCategoryGroupGridProps {
    children: React.ReactNode
    className?: string
}

function DashboardCategoryGroupGrid({ children, className = '' }: DashboardCategoryGroupGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCategoryGroupItemProps {
    dashboard: Dashboard
    onCardClick?: (dashboard: Dashboard) => void
    className?: string
}

function DashboardCategoryGroupItem({ dashboard, onCardClick, className = '' }: DashboardCategoryGroupItemProps) {
    const handleClick = () => {
        if (onCardClick) {
            onCardClick(dashboard)
        }
    }

    return (
        <div className={className} onClick={handleClick}>
            <DashboardCard.Root className="cursor-pointer">
                <DashboardCard.Header>
                    <DashboardCard.Title to={`/app/dashboards/${dashboard.dashboardId}`}>
                        {dashboard.title}
                    </DashboardCard.Title>
                    <DashboardCard.Category
                        category={dashboard.category}
                        color={dashboard.categoryColor}
                    />
                </DashboardCard.Header>

                <DashboardCard.Description>
                    {dashboard.description}
                </DashboardCard.Description>

                <DashboardCard.Footer>
                    <DashboardCard.Workspace workspace={dashboard.workspace} />
                    <DashboardCard.Updated updatedAt="just now" />
                </DashboardCard.Footer>
            </DashboardCard.Root>
        </div>
    )
}

export const DashboardCategoryGroup = {
    Root: DashboardCategoryGroupRoot,
    Header: DashboardCategoryGroupHeader,
    Title: DashboardCategoryGroupTitle,
    Workspace: DashboardCategoryGroupWorkspace,
    Grid: DashboardCategoryGroupGrid,
    Item: DashboardCategoryGroupItem,
}