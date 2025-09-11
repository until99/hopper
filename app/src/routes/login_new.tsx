import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// auth
import { useAuth } from "../hooks/auth/useAuth";

import { CpuIcon, EnvelopeIcon, KeyIcon, SpinnerGapIcon, UserIcon } from "@phosphor-icons/react";
import { Icon } from "../components/ui/icon";
import { Input } from "../components/ui/Input";

export const Route = createFileRoute("/login_new")({
  component: LoginPage,
});

export function LoginPage() {
  const defaultRoute = "/app/dashboards/list-dashboards";

  const router = useRouter();
  const { user, login, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    fullName?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (user) {
      router.navigate({ to: defaultRoute });
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: { 
      email?: string; 
      password?: string; 
      fullName?: string;
    } = {};

    // Validação básica
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (isRegisterMode && (!fullName || fullName.trim().length < 2)) {
      newErrors.fullName = "Nome completo é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isRegisterMode) {
        result = await register(email, password, fullName);
      } else {
        result = await login(email, password);
      }

      if (result.error) {
        setErrors({ general: result.error.message });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({ general: "Erro inesperado. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrors({});
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 flex-col space-y-8">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Icon.Root icon={CpuIcon} size={48} bgColor="blue">
            <Icon.Button padding={3} />
          </Icon.Root>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">Hopper</h1>

        <h2 className="text-xl font-semibold text-slate-900">
          {isRegisterMode ? "Criar conta" : "Entrar na sua conta"}
        </h2>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Erro geral */}
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Nome completo (apenas no registro) */}
          {isRegisterMode && (
            <div>
              <Input.Root>
                <Input.Field
                  id="fullName"
                  type="text"
                  placeholder="Nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<UserIcon size={20} />}
                />
              </Input.Root>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <Input.Root>
              <Input.Field
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EnvelopeIcon size={20} />}
              />
            </Input.Root>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <Input.Root>
              <Input.Field
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<KeyIcon size={20} />}
              />
            </Input.Root>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <SpinnerGapIcon size={20} className="animate-spin" />}
            {isRegisterMode ? "Criar conta" : "Entrar"}
          </button>
        </form>

        {/* Toggle entre login e registro */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isRegisterMode 
              ? "Já tem uma conta? Faça login" 
              : "Não tem uma conta? Cadastre-se"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
