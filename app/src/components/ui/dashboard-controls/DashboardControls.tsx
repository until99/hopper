import { Button } from '../button'

interface DashboardControlsRootProps {
    children: React.ReactNode
    className?: string
}

function DashboardControlsRoot({ children, className = '' }: DashboardControlsRootProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {children}
        </div>
    )
}

interface DashboardControlsBackButtonProps {
    onBack: () => void
    className?: string
}

function DashboardControlsBackButton({ onBack, className = '' }: DashboardControlsBackButtonProps) {
    return (
        <Button.Root
            onClick={onBack}
            className={`btn-transition border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 mr-4 ${className}`}
        >
            <Button.IconLeft icon="←" />
            Back to Dashboards
        </Button.Root>
    )
}

interface DashboardControlsActionButtonProps {
    onClick: () => void
    children: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    className?: string
}

function DashboardControlsActionButton({
    onClick,
    children,
    icon,
    disabled = false,
    className = ''
}: DashboardControlsActionButtonProps) {
    return (
        <Button.Root
            onClick={onClick}
            disabled={disabled}
            className={`btn-transition border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${className}`}
        >
            {icon && <Button.IconLeft icon={icon} />}
            {children}
        </Button.Root>
    )
}

interface DashboardControlsRefreshButtonProps {
    onRefresh: () => void
    refreshing?: boolean
    className?: string
}

function DashboardControlsRefreshButton({
    onRefresh,
    refreshing = false,
    className = ''
}: DashboardControlsRefreshButtonProps) {
    return (
        <DashboardControlsActionButton
            onClick={onRefresh}
            disabled={refreshing}
            icon="🔄"
            className={`${refreshing ? 'animate-spin' : ''} ${className}`}
        >
            Refresh
        </DashboardControlsActionButton>
    )
}

interface DashboardControlsExportButtonProps {
    onExport: () => void
    className?: string
}

function DashboardControlsExportButton({ onExport, className = '' }: DashboardControlsExportButtonProps) {
    return (
        <DashboardControlsActionButton
            onClick={onExport}
            icon="📤"
            className={className}
        >
            Export
        </DashboardControlsActionButton>
    )
}

interface DashboardControlsFullscreenButtonProps {
    onFullscreen: () => void
    isFullscreen?: boolean
    className?: string
}

function DashboardControlsFullscreenButton({
    onFullscreen,
    isFullscreen = false,
    className = ''
}: DashboardControlsFullscreenButtonProps) {
    return (
        <DashboardControlsActionButton
            onClick={onFullscreen}
            icon={isFullscreen ? "⇲" : "⇱"}
            className={className}
        >
            Fullscreen
        </DashboardControlsActionButton>
    )
}

interface DashboardControlsShareButtonProps {
    onShare: () => void
    className?: string
}

function DashboardControlsShareButton({ onShare, className = '' }: DashboardControlsShareButtonProps) {
    return (
        <DashboardControlsActionButton
            onClick={onShare}
            icon="🔗"
            className={className}
        >
            Share
        </DashboardControlsActionButton>
    )
}

interface DashboardControlsTitleProps {
    title: string
    description?: string
    className?: string
}

function DashboardControlsTitle({ title, description, className = '' }: DashboardControlsTitleProps) {
    return (
        <div className={`flex-1 ${className}`}>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
        </div>
    )
}

export const DashboardControls = {
    Root: DashboardControlsRoot,
    BackButton: DashboardControlsBackButton,
    ActionButton: DashboardControlsActionButton,
    RefreshButton: DashboardControlsRefreshButton,
    ExportButton: DashboardControlsExportButton,
    FullscreenButton: DashboardControlsFullscreenButton,
    ShareButton: DashboardControlsShareButton,
    Title: DashboardControlsTitle,
}