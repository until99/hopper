import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/database/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/database/"!</div>
}
