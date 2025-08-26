import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setting/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/setting/user/"!</div>
}
