import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/group/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/group/"!</div>
}
