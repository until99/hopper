import { type Dashboard } from '../../../interfaces/dashboard'
import { Link } from '@tanstack/react-router'

interface DashboardCardRootProps {
    children: React.ReactNode
    className?: string
}

function DashboardCardRoot({ children, className = '' }: DashboardCardRootProps) {
    return (
        <div className={`dashboard-card bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCardHeaderProps {
    children: React.ReactNode
    className?: string
}

function DashboardCardHeader({ children, className = '' }: DashboardCardHeaderProps) {
    return (
        <div className={`flex items-start justify-between mb-3 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCardTitleProps {
    children: React.ReactNode
    to?: string
    className?: string
}

function DashboardCardTitle({ children, to, className = '' }: DashboardCardTitleProps) {
    const titleClasses = `text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors ${className}`

    if (to) {
        return (
            <Link to={to} className={titleClasses}>
                {children}
            </Link>
        )
    }

    return (
        <h3 className={titleClasses}>
            {children}
        </h3>
    )
}

interface DashboardCardCategoryProps {
    category: string
    color: Dashboard['categoryColor']
    className?: string
}

function DashboardCardCategory({ category, color, className = '' }: DashboardCardCategoryProps) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        emerald: 'bg-emerald-100 text-emerald-800',
        violet: 'bg-violet-100 text-violet-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        slate: 'bg-slate-100 text-slate-800',
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
            {category}
        </span>
    )
}

interface DashboardCardDescriptionProps {
    children: React.ReactNode
    className?: string
}

function DashboardCardDescription({ children, className = '' }: DashboardCardDescriptionProps) {
    return (
        <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${className}`}>
            {children}
        </p>
    )
}

interface DashboardCardFooterProps {
    children: React.ReactNode
    className?: string
}

function DashboardCardFooter({ children, className = '' }: DashboardCardFooterProps) {
    return (
        <div className={`flex items-center justify-between text-xs text-gray-500 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardCardWorkspaceProps {
    workspace: string
    className?: string
}

function DashboardCardWorkspace({ workspace, className = '' }: DashboardCardWorkspaceProps) {
    return (
        <span className={`flex items-center ${className}`}>
            <span className="mr-1">📁</span>
            {workspace}
        </span>
    )
}

interface DashboardCardUpdatedProps {
    updatedAt: string
    className?: string
}

function DashboardCardUpdated({ updatedAt, className = '' }: DashboardCardUpdatedProps) {
    return (
        <span className={className}>
            Updated {updatedAt}
        </span>
    )
}

export const DashboardCard = {
    Root: DashboardCardRoot,
    Header: DashboardCardHeader,
    Title: DashboardCardTitle,
    Category: DashboardCardCategory,
    Description: DashboardCardDescription,
    Footer: DashboardCardFooter,
    Workspace: DashboardCardWorkspace,
    Updated: DashboardCardUpdated,
}