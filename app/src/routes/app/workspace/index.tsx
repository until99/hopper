import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/workspace/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/"!</div>
}
