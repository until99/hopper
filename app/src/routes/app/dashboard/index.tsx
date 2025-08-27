import { createFileRoute } from '@tanstack/react-router';

import { Aside } from '../../../components/layout/aside/Aside';
import { Navbar } from '../../../components/layout/navbar/Navbar';

export const Route = createFileRoute('/app/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex min-h-screen overflow-auto'>
      <Aside />
      <Navbar />
    </div>
  );
}
