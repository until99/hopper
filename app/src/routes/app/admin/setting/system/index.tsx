import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../../../components/layout/main'

export const Route = createFileRoute('/app/admin/setting/system/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>System Settings</h1>
      </Main.Body>
    </Main.Root>
  )
}
