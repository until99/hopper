import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../../../components/layout/main'

export const Route = createFileRoute('/app/admin/report/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>Report</h1>
      </Main.Body>
    </Main.Root>
  )
}