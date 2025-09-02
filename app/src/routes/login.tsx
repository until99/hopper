import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// auth
import { useAuth } from "../hooks/auth/useAuth";


import { CpuIcon, EnvelopeIcon, KeyIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Icon } from "../components/ui/icon";
import { Input } from "../components/ui/Input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const defaultRoute = "/app/dashboards/list-dashboards";

  const router = useRouter();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    if (user) {
      router.navigate({ to: defaultRoute });
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      console.log("Password is required");
      newErrors.password = "Senha é obrigatória";
    } else if (password.length <= 6) {
      newErrors.password = "Senha deve ter mais que 6 caracteres";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Senha deve conter pelo menos uma letra maiúscula";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Senha deve conter pelo menos uma letra minúscula";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Senha deve conter pelo menos um caractere especial";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await login(email, password);

      // Adiciona um delay fixo de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (error) {
        console.log("Username or password is incorrect");
        setErrors({ password: "Username or password is incorrect" });
      } else {
        router.navigate({ to: defaultRoute });
      }
    } catch (error) {

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
          Entrar na sua conta
        </h2>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>

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
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
