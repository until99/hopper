import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useAuth } from '../../../lib/useAuth';
import { useEffect } from 'react';

export const Route = createFileRoute('/app/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!loading && !user) {
      router.navigate({ to: '/signin' });
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.navigate({ to: '/signin' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao Hopper!
                </h2>
                <p className="text-gray-600 mb-4">
                  Você está logado como: <strong>{user.email}</strong>
                </p>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p>✓ Autenticação funcionando corretamente!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
