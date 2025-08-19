import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/admin_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin_dashboard"!</div>
}
