import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "../hooks/auth/useAuth";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.navigate({ to: "/app/dashboard" });
    }
  }, [user, router]);

  return (
    <>
      <h1 className="text-2xl font-bold">teste</h1>
    </>
    // <div className="bg-red-500 h-screen w-screen flex flex-col justify-center items-center">
    //   <Logo.Root />
    // </div>
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //     <div className="max-w-md w-full space-y-8">
    //         <div>
    //             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    //                 {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
    //             </h2>
    //             <p className="mt-2 text-center text-sm text-gray-600">
    //                 {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
    //                 <button
    //                     onClick={toggleMode}
    //                     className="font-medium text-indigo-600 hover:text-indigo-500"
    //                 >
    //                     {isLogin ? "Cadastre-se aqui" : "Entre aqui"}
    //                 </button>
    //             </p>
    //         </div>

    //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    //             <div className="rounded-md shadow-sm -space-y-px">
    //                 <div>
    //                     <label htmlFor="email-address" className="sr-only">
    //                         Endereço de email
    //                     </label>
    //                     <input
    //                         id="email-address"
    //                         name="email"
    //                         type="email"
    //                         autoComplete="email"
    //                         required
    //                         className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    //                         placeholder="Endereço de email"
    //                         value={email}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                         disabled={loading}
    //                     />
    //                 </div>
    //                 <div>
    //                     <label htmlFor="password" className="sr-only">
    //                         Senha
    //                     </label>
    //                     <input
    //                         id="password"
    //                         name="password"
    //                         type="password"
    //                         autoComplete={isLogin ? "current-password" : "new-password"}
    //                         required
    //                         className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    //                         placeholder="Senha"
    //                         minLength={6}
    //                         value={password}
    //                         onChange={(e) => setPassword(e.target.value)}
    //                         disabled={loading}
    //                     />
    //                 </div>
    //             </div>

    //             {message && (
    //                 <div className={`rounded-md p-4 ${message.includes("sucesso") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
    //                     }`}>
    //                     <p className="text-sm">{message}</p>
    //                 </div>
    //             )}

    //             <div>
    //                 <button
    //                     type="submit"
    //                     disabled={loading}
    //                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //                 >
    //                     {loading ? (
    //                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //                         </svg>
    //                     ) : null}
    //                     {loading ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar")}
    //                 </button>
    //             </div>
    //         </form>
    //     </div>
    // </div>
  );
}
