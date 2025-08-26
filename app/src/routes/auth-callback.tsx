import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth-callback')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Email confirmado! Agora faça login.</p>
    </div>
  )
}
