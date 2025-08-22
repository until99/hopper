import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CpuIcon,
  UserIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@phosphor-icons/react";
import authentication from "../../store/auth/authentication";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      console.log("Registration attempt:", formData);
      authentication.setUserIconAuthenticated(true);
      navigate({ to: "/dashboard/list-dashboards" });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
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
            Criar nova conta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ou{" "}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              entrar na sua conta existente
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <UserIcon
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
                    size={18}
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`flex h-9 w-full rounded-lg border bg-white px-3 py-1 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none ${
                      errors.name
                        ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    }`}
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

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
                    className={`flex h-9 w-full rounded-lg border bg-white px-3 py-1 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none ${
                      errors.email
                        ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    }`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`flex h-9 w-full rounded-lg border bg-white px-3 py-1 pr-10 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none ${
                      errors.password
                        ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    }`}
                    placeholder="Escolha uma senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Confirmar senha
                </label>
                <div className="relative">
                  <LockIcon
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
                    size={18}
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`flex h-9 w-full rounded-lg border bg-white px-3 py-1 pr-10 pl-10 text-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none ${
                      errors.confirmPassword
                        ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    }`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-slate-700"
              >
                Concordo com os{" "}
                <a
                  href="#"
                  className="text-blue-600 transition-colors hover:text-blue-500"
                >
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-blue-600 transition-colors hover:text-blue-500"
                >
                  Política de Privacidade
                </a>
              </label>
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
                    Criando conta...
                  </div>
                ) : (
                  "Criar conta"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  Entrar
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
