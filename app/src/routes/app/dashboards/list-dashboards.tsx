import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../components/layout/main'

export const Route = createFileRoute('/app/dashboards/list-dashboards')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>List Dashboards</h1>
      </Main.Body>
    </Main.Root>
  )
}
