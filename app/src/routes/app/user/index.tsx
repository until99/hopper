import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/"!</div>
}
