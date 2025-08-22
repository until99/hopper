import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CpuIcon,
  EnvelopeIcon,
  LockIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import authentication from "../../store/auth/authentication";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      authentication.setUserAuthenticated(true);
      navigate({ to: "/dashboard/list-dashboards" });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header com logo */}
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <CpuIcon
              size={48}
              className="rounded-lg bg-blue-500 p-3 text-white"
            />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Hopper</h1>
          <h2 className="text-xl font-semibold text-slate-900">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ou{" "}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              criar uma nova conta
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  E-mail
                </label>
                <div className="relative">
                  <EnvelopeIcon
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Senha
                </label>
                <div className="relative">
                  <LockIcon
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
                    size={18}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pr-10 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-700"
                >
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Não tem uma conta?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  Registrar-se
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          <a
            href="#"
            className="rounded-full bg-red-300 px-3 py-1 text-xs font-semibold text-red-800"
          >
            Development
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
