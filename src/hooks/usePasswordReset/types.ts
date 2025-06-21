
export interface PasswordResetFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetHookReturn {
  formData: PasswordResetFormData;
  setFormData: (data: PasswordResetFormData) => void;
  isLoading: boolean;
  handleSubmit: () => Promise<boolean>;
  resetForm: () => void;
}
