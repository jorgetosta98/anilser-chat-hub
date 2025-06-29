
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AILoading } from '@/components/ui/ai-loading';
import { PageTransition } from '@/components/ui/page-transition';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthLoginForm } from '@/components/auth/AuthLoginForm';
import { AuthSignupForm } from '@/components/auth/AuthSignupForm';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuthRedirect();

  // Se está carregando a autenticação ou fazendo login, mostrar loading
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AILoading message="Autenticando..." />
      </div>
    );
  }

  // Se já está logado, o hook useAuthRedirect vai redirecionar automaticamente
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AILoading message="Redirecionando..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader />

          <Card className="w-full">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <AuthLoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </TabsContent>
              
              <TabsContent value="signup">
                <AuthSignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
