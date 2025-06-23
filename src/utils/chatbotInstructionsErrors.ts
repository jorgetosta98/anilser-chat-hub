
export function getChatbotInstructionsErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('duplicate key')) {
      return "Já existe uma configuração ativa. Tente atualizar a configuração existente.";
    } else if (error.message.includes('permission')) {
      return "Você não tem permissão para salvar essas configurações.";
    } else if (error.message.includes('validation')) {
      return "Dados inválidos. Verifique os campos obrigatórios.";
    }
  }
  
  return "Não foi possível salvar as configurações. Tente novamente.";
}
