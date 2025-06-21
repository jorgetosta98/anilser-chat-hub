
import { validatePassword } from "@/utils/passwordValidation";
import { PasswordResetFormData } from "./types";

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validatePasswordResetForm = (formData: PasswordResetFormData): ValidationResult => {
  // Check if fields are filled
  if (!formData.newPassword || !formData.confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Por favor, preencha todos os campos."
    };
  }

  // Check if passwords match
  if (formData.newPassword !== formData.confirmPassword) {
    return {
      isValid: false,
      errorMessage: "As senhas não coincidem."
    };
  }

  // Validate password strength
  const passwordErrors = validatePassword(formData.newPassword);
  if (passwordErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: passwordErrors.join(". ")
    };
  }

  return { isValid: true };
};
