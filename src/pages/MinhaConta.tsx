import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CreditCard, User, Lock, FileText } from "lucide-react";

export default function MinhaConta() {
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
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Mantenha seus dados atualizados</p>
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
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
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
                  <Button variant="link" className="text-primary p-0 h-auto">
                    Alterar cartão de crédito
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                  Alterar Plano
                </Button>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-red-50">
                  Cancelar Assinatura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
