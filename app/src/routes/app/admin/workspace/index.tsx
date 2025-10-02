import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../../components/layout/main'

export const Route = createFileRoute('/app/admin/workspace/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>Workspace</h1>
      </Main.Body>
    </Main.Root>
  )
}