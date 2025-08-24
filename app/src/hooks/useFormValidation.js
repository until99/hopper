import { useState } from "react";

const useFormValidation = (initialState, validationRules) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return "";

    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) return error;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    validateField,
    resetForm,
    setFormData,
  };
};

// Validation rules helpers
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      return "Este campo é obrigatório";
    }
    return "";
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "E-mail inválido";
    }
    return "";
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Deve ter pelo menos ${min} caracteres`;
    }
    return "";
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Deve ter no máximo ${max} caracteres`;
    }
    return "";
  },

  passwordMatch: (fieldName) => (value, formData) => {
    if (value && formData[fieldName] && value !== formData[fieldName]) {
      return "Senhas não coincidem";
    }
    return "";
  },

  phone: (value) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (value && !phoneRegex.test(value)) {
      return "Número de telefone inválido";
    }
    return "";
  },
};

export default useFormValidation;
