import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/group/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/group/"!</div>
}
