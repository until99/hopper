import { createFileRoute } from '@tanstack/react-router';
import { Main } from '../../../../components/layout/main/index';

export const Route = createFileRoute('/app/admin/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Main.Root>
      <Main.Aside />
      <Main.Body>
        <h1>Dashboard</h1>
      </Main.Body>
    </Main.Root>
  );
}
