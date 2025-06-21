
export const validatePassword = (password: string) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push("A senha deve ter pelo menos 6 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }
  
  return errors;
};
