import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: NotFoundPage,
})

export function NotFoundPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">404</h1>
          <p className="text-lg text-gray-500">Página não encontrada</p>
        </div>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Voltar para o início
        </Link>
      </div>
    </>
  )
}