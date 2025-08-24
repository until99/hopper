import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import authentication from "../../../store/auth/authentication";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      authentication.setUserAuthenticated(true);
      navigate({ to: "/dashboard/list-dashboards" });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      authentication.setUserAuthenticated(true);
      navigate({ to: "/dashboard/list-dashboards" });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar conta",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authentication.setUserAuthenticated(false);
    navigate({ to: "/auth/login", replace: true });
  };

  const isAuthenticated = () => {
    return authentication.isUserAuthenticated();
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
