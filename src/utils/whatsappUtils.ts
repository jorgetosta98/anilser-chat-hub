
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export function createCountdownTimer(
  initialTime: number, 
  onTick: (timeLeft: number) => void,
  onComplete: () => void
): () => void {
  let timeLeft = initialTime;
  
  const interval = setInterval(() => {
    timeLeft -= 1;
    onTick(timeLeft);
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      onComplete();
    }
  }, 1000);

  // Return cleanup function
  return () => clearInterval(interval);
}
