
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
        <CardDescription>Informações em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Sistema Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Base de Dados OK</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">API com Latência</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
