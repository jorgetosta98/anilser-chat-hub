
import { useState } from "react";
import { AILoading } from "@/components/ui/ai-loading";
import { PageTransition } from "@/components/ui/page-transition";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginBackground } from "@/components/auth/LoginBackground";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  // Se está carregando, mostrar o loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AILoading message="Fazendo login..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <LoginForm />
        </div>

        {/* Right side - Image */}
        <LoginBackground />
      </div>
    </PageTransition>
  );
}
