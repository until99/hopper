import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/"!</div>
}
