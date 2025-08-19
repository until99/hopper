import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboards')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboards"!</div>
}
