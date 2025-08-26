import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/database/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/database/"!</div>
}
