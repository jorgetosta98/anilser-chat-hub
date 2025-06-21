
import { MessageSquare, Plus, BarChart3, Link, User, LogOut, FileText, Palette, Users, Settings, CreditCard } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: any;
  path: string;
  action?: boolean | string;
  danger?: boolean;
}

export interface ChatItem {
  id: number;
  title: string;
  date: string;
}

export const regularTopMenuItems: MenuItem[] = [{
  title: "Nova Conversa",
  icon: Plus,
  path: "/",
  action: true
}];

export const regularBottomMenuItems: MenuItem[] = [{
  title: "Conexões",
  icon: Link,
  path: "/conexoes"
}, {
  title: "Base de Conhecimento",
  icon: FileText,
  path: "/base-conhecimento"
}, {
  title: "Personalização",
  icon: Palette,
  path: "/personalizacao"
}, {
  title: "Relatórios",
  icon: BarChart3,
  path: "/relatorios"
}, {
  title: "Minha Conta",
  icon: User,
  path: "/minha-conta"
}, {
  title: "Sair",
  icon: LogOut,
  path: "/login",
  danger: true,
  action: "logout"
}];

export const adminTopMenuItems: MenuItem[] = [{
  title: "Dashboard",
  icon: BarChart3,
  path: "/admin"
}, {
  title: "Usuários",
  icon: Users,
  path: "/admin/users"
}, {
  title: "Conversas",
  icon: MessageSquare,
  path: "/admin/conversations"
}, {
  title: "Planos",
  icon: CreditCard,
  path: "/admin/plans"
}];

export const adminBottomMenuItems: MenuItem[] = [{
  title: "Configurações",
  icon: Settings,
  path: "/admin/settings"
}, {
  title: "Minha Conta",
  icon: User,
  path: "/admin/minha-conta"
}, {
  title: "Sair",
  icon: LogOut,
  path: "/login",
  danger: true,
  action: "logout"
}];

export const recentChats: ChatItem[] = [{
  id: 1,
  title: "Consulta sobre segurança",
  date: "Hoje"
}, {
  id: 2,
  title: "Dúvidas sobre relatórios",  
  date: "Ontem"
}, {
  id: 3,
  title: "Configuração inicial",
  date: "2 dias atrás"
}, {
  id: 4,
  title: "Integração WhatsApp",
  date: "3 dias atrás"
}, {
  id: 5,
  title: "Problemas de conexão",
  date: "4 dias atrás"
}, {
  id: 6,
  title: "Análise de dados",
  date: "5 dias atrás"
}, {
  id: 7,
  title: "Configuração de alertas",
  date: "6 dias atrás"
}, {
  id: 8,
  title: "Backup de informações",
  date: "1 semana atrás"
}, {
  id: 9,
  title: "Suporte técnico",
  date: "1 semana atrás"
}, {
  id: 10,
  title: "Tutorial inicial",
  date: "2 semanas atrás"
}];
