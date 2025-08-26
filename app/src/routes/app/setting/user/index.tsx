import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/setting/user/"!</div>
}
