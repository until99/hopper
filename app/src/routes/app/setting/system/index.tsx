import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting/system/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/setting/system/"!</div>
}
