
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, UserPlus, MoreHorizontal, Ban, CheckCircle, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PLANS } from "@/types/plans";

// Mock data expandido - em um app real viria de uma API
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    status: "ativo",
    role: "usuário",
    plan: "free",
    lastLogin: "2024-01-15 14:30",
    conversations: 45,
    questionsUsed: 8,
    whatsappConnections: 1
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    status: "ativo",
    role: "admin",
    plan: "premium",
    lastLogin: "2024-01-15 16:45",
    conversations: 12,
    questionsUsed: 234,
    whatsappConnections: 3
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@empresa.com",
    status: "inativo",
    role: "usuário",
    plan: "basic",
    lastLogin: "2024-01-10 09:15",
    conversations: 23,
    questionsUsed: 67,
    whatsappConnections: 2
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@empresa.com",
    status: "ativo",
    role: "usuário",
    plan: "basic",
    lastLogin: "2024-01-15 11:20",
    conversations: 67,
    questionsUsed: 89,
    whatsappConnections: 1
  }
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "ativo" ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Ban className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getPlanBadge = (planId: string) => {
    const plan = DEFAULT_PLANS.find(p => p.id === planId);
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[planId as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {plan?.name || planId}
      </Badge>
    );
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleChangePlan = (userId: number, newPlan: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, plan: newPlan } : user
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários do sistema, permissões, planos e status
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Uso Atual</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getPlanBadge(user.plan)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.questionsUsed} perguntas hoje</div>
                        <div className="text-muted-foreground">{user.whatsappConnections} WhatsApp</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Select
                          value={user.plan}
                          onValueChange={(value) => handleChangePlan(user.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Plano" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_PLANS.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={user.status === 'ativo' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}
                        >
                          {user.status === 'ativo' ? (
                            <>
                              <Ban className="w-4 h-4 mr-1" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Ativar
                            </>
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de usuários */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'ativo').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usuários Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {users.filter(u => u.status === 'inativo').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Planos Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.plan === 'premium').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
