import { createRootRoute, Outlet, Link } from "@tanstack/react-router"

function NotFoundComponent() {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Página não encontrada</h2>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/app/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});
