
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Filter, Download } from "lucide-react";
import { useState } from "react";

// Mock data - em um app real viria de uma API
const mockConversations = [
  {
    id: 1,
    user: "João Silva",
    title: "Consulta sobre segurança",
    status: "concluída",
    messages: 8,
    startTime: "2024-01-15 14:30",
    duration: "12 min",
    topic: "Segurança"
  },
  {
    id: 2,
    user: "Maria Santos",
    title: "Dúvidas sobre relatórios",
    status: "ativa",
    messages: 5,
    startTime: "2024-01-15 16:45",
    duration: "5 min",
    topic: "Relatórios"
  },
  {
    id: 3,
    user: "Pedro Costa",
    title: "Configuração inicial",
    status: "pausada",
    messages: 3,
    startTime: "2024-01-15 10:20",
    duration: "18 min",
    topic: "Configuração"
  },
  {
    id: 4,
    user: "Ana Oliveira",
    title: "Integração WhatsApp",
    status: "concluída",
    messages: 15,
    startTime: "2024-01-15 09:15",
    duration: "25 min",
    topic: "Integração"
  }
];

export function ConversationMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(conv =>
    conv.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ativa': { color: 'bg-blue-500', text: 'Ativa' },
      'concluída': { color: 'bg-green-500', text: 'Concluída' },
      'pausada': { color: 'bg-yellow-500', text: 'Pausada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pausada;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monitoramento de Conversas</CardTitle>
              <CardDescription>
                Acompanhe conversas em tempo real e histórico
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
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
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tópico</TableHead>
                  <TableHead>Mensagens</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-medium">{conversation.user}</TableCell>
                    <TableCell>{conversation.title}</TableCell>
                    <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{conversation.topic}</Badge>
                    </TableCell>
                    <TableCell>{conversation.messages}</TableCell>
                    <TableCell>{conversation.startTime}</TableCell>
                    <TableCell>{conversation.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de conversas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conversas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89</div>
            <p className="text-xs text-muted-foreground">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ativas Agora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conversations.filter(c => c.status === 'ativa').length}
            </div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">15 min</div>
            <p className="text-xs text-muted-foreground">Por conversa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taxa de Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <p className="text-xs text-muted-foreground">Conversas resolvidas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
