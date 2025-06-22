
import { Home, MessageSquare, Book, Settings, BarChart3, Bot, Users, Shield, LogOut } from "lucide-react";

export interface MenuItem {
  title: string;
  url?: string;
  path?: string;
  icon: any;
  action?: string;
  danger?: boolean;
}

export const regularUserMenuItems = [
  {
    title: "Chat",
    url: "/chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Base de Conhecimento",
    url: "/base-conhecimento",
    path: "/base-conhecimento",
    icon: Book,
  },
  {
    title: "Instruções do Chatbot",
    url: "/instrucoes-chatbot",
    path: "/instrucoes-chatbot",
    icon: Bot,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    path: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Conexões",
    url: "/conexoes",
    path: "/conexoes",
    icon: Shield,
  },
  {
    title: "Minha Conta",
    url: "/minha-conta",
    path: "/minha-conta",
    icon: Settings,
  },
];

export const regularBottomMenuItems = [
  {
    title: "Minha Conta",
    url: "/minha-conta",
    path: "/minha-conta",
    icon: Settings,
  },
  {
    title: "Sair",
    url: "#",
    path: "#",
    icon: LogOut,
    action: "logout",
    danger: true,
  },
];

export const adminTopMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    path: "/admin",
    icon: Home,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    path: "/admin/users",
    icon: Users,
  },
];

export const adminBottomMenuItems = [
  {
    title: "Minha Conta",
    url: "/admin/minha-conta",
    path: "/admin/minha-conta",
    icon: Settings,
  },
  {
    title: "Sair",
    url: "#",
    path: "#",
    icon: LogOut,
    action: "logout",
    danger: true,
  },
];

export const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    path: "/admin",
    icon: Home,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Minha Conta",
    url: "/admin/minha-conta",
    path: "/admin/minha-conta",
    icon: Settings,
  },
];
