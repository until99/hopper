import { useState, createContext, useContext } from 'react'
import { type Dashboard } from '../../../interfaces/dashboard'
import { DashboardCard } from '../dashboard-card'
import { CaretDownIcon } from '@phosphor-icons/react'

interface DashboardCategoryGroupContextType {
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}

const DashboardCategoryGroupContext = createContext<DashboardCategoryGroupContextType | undefined>(undefined)

const useDashboardCategoryGroup = () => {
    const context = useContext(DashboardCategoryGroupContext)
    if (!context) {
        throw new Error('useDashboardCategoryGroup must be used within a DashboardCategoryGroupRoot')
    }
    return context
}

interface DashboardCategoryGroupRootProps {
    children: React.ReactNode
    className?: string
    defaultCollapsed?: boolean
}

function DashboardCategoryGroupRoot({ children, className = '', defaultCollapsed = false }: DashboardCategoryGroupRootProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    return (
        <div className={`mb-8 ${className}`}>
            <DashboardCategoryGroupContext.Provider value={{ isCollapsed, setIsCollapsed }}>
                {children}
            </DashboardCategoryGroupContext.Provider>
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
    const { isCollapsed, setIsCollapsed } = useDashboardCategoryGroup()

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className={`flex items-center ${className}`}>
            <button
                onClick={handleToggle}
                className="flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                aria-expanded={!isCollapsed}
                type="button"
            >
                <span
                    className={`mr-2 transition-transform duration-200 ${isCollapsed ? 'rotate-[-90deg]' : 'rotate-0'}`}
                >
                    <CaretDownIcon />
                </span>
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
        <span className={`text-sm  ${className}`}>
            {workspace}
        </span>
    )
}

interface DashboardCategoryGroupGridProps {
    children: React.ReactNode
    className?: string
}

function DashboardCategoryGroupGrid({ children, className = '' }: DashboardCategoryGroupGridProps) {
    const { isCollapsed } = useDashboardCategoryGroup()

    if (isCollapsed) {
        return null
    }

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