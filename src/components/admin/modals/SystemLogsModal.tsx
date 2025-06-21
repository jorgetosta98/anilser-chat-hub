
import { useState } from "react";
import { FormModal } from "@/components/modals/FormModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  user?: string;
  module: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:22Z",
    level: "error",
    message: "Falha ao conectar com WhatsApp API - Timeout após 30 segundos",
    user: "joão.silva@email.com",
    module: "WhatsApp Integration"
  },
  {
    id: "2",
    timestamp: "2024-01-15T14:25:10Z",
    level: "info",
    message: "Usuário realizou login com sucesso",
    user: "maria.santos@email.com",
    module: "Authentication"
  },
  {
    id: "3",
    timestamp: "2024-01-15T14:20:05Z",
    level: "warning",
    message: "Limite de mensagens mensais próximo do limite (95%)",
    user: "pedro.costa@email.com",
    module: "Billing"
  },
  {
    id: "4",
    timestamp: "2024-01-15T14:15:30Z",
    level: "debug",
    message: "Cache invalidado para usuário após atualização de perfil",
    user: "ana.oliveira@email.com",
    module: "Cache Management"
  }
];

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemLogsModal({
  isOpen,
  onClose
}: SystemLogsModalProps) {
  const [filters, setFilters] = useState({
    level: "all",
    module: "all",
    search: "",
    dateRange: "today"
  });
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(false);

  const levelColors = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800", 
    error: "bg-red-100 text-red-800",
    debug: "bg-gray-100 text-gray-800"
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs([...mockLogs]); // Refresh with same data for demo
    } catch (error) {
      console.error("Error refreshing logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filters.level === "all" || log.level === filters.level;
    const matchesModule = filters.module === "all" || log.module === filters.module;
    const matchesSearch = !filters.search || 
      log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.user?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesLevel && matchesModule && matchesSearch;
  });

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Logs do Sistema"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por mensagem ou usuário..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select 
            value={filters.level} 
            onValueChange={(value) => setFilters({...filters, level: value})}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.module} 
            onValueChange={(value) => setFilters({...filters, module: value})}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os módulos</SelectItem>
              <SelectItem value="Authentication">Autenticação</SelectItem>
              <SelectItem value="WhatsApp Integration">WhatsApp</SelectItem>
              <SelectItem value="Billing">Faturamento</SelectItem>
              <SelectItem value="Cache Management">Cache</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Logs Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Timestamp</th>
                  <th className="text-left p-3 font-medium">Nível</th>
                  <th className="text-left p-3 font-medium">Módulo</th>
                  <th className="text-left p-3 font-medium">Mensagem</th>
                  <th className="text-left p-3 font-medium">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <Badge className={levelColors[log.level]}>
                        {log.level.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{log.module}</td>
                    <td className="p-3 text-sm max-w-md">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{log.user || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum log encontrado com os filtros aplicados.
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Exibindo {filteredLogs.length} de {logs.length} registros
        </div>
      </div>
    </FormModal>
  );
}
