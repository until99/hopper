import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/report/"!</div>
}
