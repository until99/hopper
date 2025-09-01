import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../../components/layout/main'

export const Route = createFileRoute('/app/setting/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>User Settings</h1>
      </Main.Body>
    </Main.Root>
  )
}
