import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// auth
import { useAuth } from "../hooks/auth/useAuth";


import { CpuIcon, EnvelopeIcon, KeyIcon, SpinnerGapIcon, UserIcon, ToggleLeftIcon, ToggleRightIcon } from "@phosphor-icons/react";
import { Icon } from "../components/ui/icon";
import { Input } from "../components/ui/Input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const defaultRoute = "/app/dashboards/list-dashboards";

  const router = useRouter();
  const { user, login, register, useSupabaseAuth, toggleAuthMode } = useAuth();

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

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length <= 6) {
      newErrors.password = "Senha deve ter mais que 6 caracteres";
    }

    if (isRegisterMode && !fullName.trim()) {
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

      // Adiciona um delay fixo de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.error) {
        setErrors({ 
          general: result.error.message || "Erro ao processar solicitação" 
        });
      } else {
        router.navigate({ to: defaultRoute });
      }
    } catch (error) {
      setErrors({ 
        general: "Erro inesperado. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
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
        {/* Seletor de modo de autenticação */}
        <div className="mb-6 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {useSupabaseAuth ? "Supabase Auth" : "API Auth"}
            </span>
            <button
              type="button"
              onClick={toggleAuthMode}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              {useSupabaseAuth ? (
                <ToggleLeftIcon size={24} />
              ) : (
                <ToggleRightIcon size={24} />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {useSupabaseAuth 
              ? "Usando autenticação Supabase" 
              : "Usando API de autenticação própria"
            }
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Erro geral */}
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Nome completo (apenas no modo registro) */}
          {isRegisterMode && (
            <Input.Root>
              <Input.Label htmlFor="fullName" innerText="Nome completo" required />
              <Input.Field
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={!!errors.fullName}
                disabled={loading}
                icon={<UserIcon />}
              />
              {errors.fullName && <Input.Error errorMessage={errors.fullName} />}
            </Input.Root>
          )}

          {/* E-mail Input */}
          <Input.Root>
            <Input.Label htmlFor="email" innerText="E-mail" required />
            <Input.Field
              id="email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              disabled={loading}
              icon={<EnvelopeIcon />}
            />
            {errors.email && <Input.Error errorMessage={errors.email} />}
          </Input.Root>

          {/* Password Input */}
          <Input.Root>
            <Input.Label htmlFor="password" innerText="Senha" required />
            <Input.Field
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              disabled={loading}
              icon={<KeyIcon />}
            />
            {errors.password && <Input.Error errorMessage={errors.password} />}
          </Input.Root>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <SpinnerGapIcon transform="translate-x-1 animate-spin" />
              </>
            ) : (
              isRegisterMode ? "Criar conta" : "Entrar"
            )}
          </button>

          {/* Botão para alternar entre login e registro */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrors({});
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {isRegisterMode 
                ? "Já tem uma conta? Faça login" 
                : "Não tem uma conta? Registre-se"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
