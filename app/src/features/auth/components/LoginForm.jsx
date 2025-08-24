import { Link } from "@tanstack/react-router";
import { EnvelopeIcon } from "@phosphor-icons/react";
import {
  Button,
  Input,
  PasswordInput,
  FormField,
  Checkbox,
} from "../../../components/ui";
import useFormValidation, {
  validationRules,
} from "../../../hooks/useFormValidation";
import useAuth from "../hooks/useAuth";
import AuthLayout from "./AuthLayout";

const LoginForm = () => {
  const { login, isLoading } = useAuth();

  const { formData, errors, handleChange, validateForm } = useFormValidation(
    {
      email: "",
      password: "",
      rememberMe: false,
    },
    {
      email: [validationRules.required, validationRules.email],
      password: [validationRules.required],
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      // Handle error (you could show a toast here)
      console.error("Login failed:", result.error);
    }
  };

  return (
    <AuthLayout
      title="Entrar na sua conta"
      subtitle="Ou"
      linkText="criar uma nova conta"
      linkTo="/auth/register"
      LinkComponent={Link}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="E-mail"
            htmlFor="email"
            error={errors.email}
            required
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              icon={EnvelopeIcon}
              placeholder="seu@email.com"
              error={errors.email}
            />
          </FormField>

          <FormField
            label="Senha"
            htmlFor="password"
            error={errors.password}
            required
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Sua senha"
              error={errors.password}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            id="remember-me"
            checked={formData.rememberMe}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
            label="Lembrar de mim"
          />

          <div className="text-sm">
            <Link
              to="#"
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

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
    </AuthLayout>
  );
};

export default LoginForm;
