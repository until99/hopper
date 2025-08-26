import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setting/system/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/setting/system/"!</div>
}
