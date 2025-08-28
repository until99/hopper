import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/report/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/"!</div>
}
