
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CreditCard, User, Lock, FileText } from "lucide-react";
import { useState } from "react";
import { UserProfileModal } from "@/components/client/modals/UserProfileModal";
import { PasswordResetModal } from "@/components/client/modals/PasswordResetModal";
import { PlanChangeModal } from "@/components/client/modals/PlanChangeModal";
import { PaymentMethodModal } from "@/components/client/modals/PaymentMethodModal";
import { CancelSubscriptionModal } from "@/components/client/modals/CancelSubscriptionModal";
import { useAuth } from "@/contexts/AuthContext";

export default function MinhaConta() {
  const { profile } = useAuth();
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [paymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
  const [cancelSubscriptionModalOpen, setCancelSubscriptionModalOpen] = useState(false);

  // Dados do usuário real ou mock se não disponível
  const userData = {
    name: profile?.full_name || "Nome do Usuário",
    email: profile?.email || "usuario@email.com",
    phone: profile?.phone || "",
    company: profile?.company || ""
  };

  const currentCard = {
    last4: "7890",
    brand: "Visa",
    expiryMonth: "12",
    expiryYear: "2027"
  };

  return (
    <div className="flex-1 p-6" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Minha Conta</h1>
        
        <div className="space-y-6">
          {/* My Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <span>Meus Dados</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setUserProfileModalOpen(true)}
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600 mb-2">Mantenha seus dados atualizados</p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Nome:</span> {userData.name}</p>
                  <p><span className="font-medium">E-mail:</span> {userData.email}</p>
                  {userData.phone && <p><span className="font-medium">Telefone:</span> {userData.phone}</p>}
                  {userData.company && <p><span className="font-medium">Empresa:</span> {userData.company}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary" />
                <span>Redefinir Senha</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Esqueceu seus dados de acesso? Defina uma nova senha e mantenha a sua conta segura.
              </p>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary-50"
                onClick={() => setPasswordResetModalOpen(true)}
              >
                Redefinir Senha
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <span>Assinatura</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plano vigente:</p>
                <p className="font-semibold">Safeboy Assinatura Anual</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  R$ 647,97
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Cartão de crédito</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm">**** **** **** 7890</p>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={() => setPaymentMethodModalOpen(true)}
                  >
                    Alterar cartão de crédito
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary-50"
                  onClick={() => setPlanChangeModalOpen(true)}
                >
                  Alterar Plano
                </Button>
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-red-50"
                  onClick={() => setCancelSubscriptionModalOpen(true)}
                >
                  Cancelar Assinatura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <UserProfileModal
        isOpen={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
        userData={userData}
      />

      <PasswordResetModal
        isOpen={passwordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
      />

      <PlanChangeModal
        isOpen={planChangeModalOpen}
        onClose={() => setPlanChangeModalOpen(false)}
        currentPlan="annual"
      />

      <PaymentMethodModal
        isOpen={paymentMethodModalOpen}
        onClose={() => setPaymentMethodModalOpen(false)}
        currentCard={currentCard}
      />

      <CancelSubscriptionModal
        isOpen={cancelSubscriptionModalOpen}
        onClose={() => setCancelSubscriptionModalOpen(false)}
        planName="Safeboy Assinatura Anual"
      />
    </div>
  );
}
