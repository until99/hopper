import { Link } from "@tanstack/react-router";
import { UserIcon, EnvelopeIcon } from "@phosphor-icons/react";
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

const RegisterForm = () => {
  const { register, isLoading } = useAuth();

  const { formData, errors, handleChange, validateForm } = useFormValidation(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    {
      name: [validationRules.required, validationRules.minLength(2)],
      email: [validationRules.required, validationRules.email],
      password: [validationRules.required, validationRules.minLength(6)],
      confirmPassword: [
        validationRules.required,
        validationRules.passwordMatch("password"),
      ],
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!formData.acceptTerms) {
      alert("Você deve aceitar os termos de uso");
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      // Handle error (you could show a toast here)
      console.error("Registration failed:", result.error);
    }
  };

  return (
    <AuthLayout
      title="Criar nova conta"
      subtitle="Ou"
      linkText="entrar na sua conta existente"
      linkTo="/auth/login"
      LinkComponent={Link}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="Nome completo"
            htmlFor="name"
            error={errors.name}
            required
          >
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              icon={UserIcon}
              placeholder="Seu nome completo"
              error={errors.name}
            />
          </FormField>

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
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Escolha uma senha"
              error={errors.password}
            />
          </FormField>

          <FormField
            label="Confirmar senha"
            htmlFor="confirmPassword"
            error={errors.confirmPassword}
            required
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirme sua senha"
              error={errors.confirmPassword}
            />
          </FormField>
        </div>

        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onChange={(e) => handleChange("acceptTerms", e.target.checked)}
          label={
            <>
              Concordo com os{" "}
              <Link
                to="#"
                className="text-blue-600 transition-colors hover:text-blue-500"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                to="#"
                className="text-blue-600 transition-colors hover:text-blue-500"
              >
                Política de Privacidade
              </Link>
            </>
          }
        />

        <Button type="submit" loading={isLoading} className="w-full">
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>

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
    </AuthLayout>
  );
};

export default RegisterForm;
