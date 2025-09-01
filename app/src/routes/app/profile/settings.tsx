import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../components/layout/main'

export const Route = createFileRoute('/app/profile/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>Profile Settings</h1>
      </Main.Body>
    </Main.Root>
  )
}
