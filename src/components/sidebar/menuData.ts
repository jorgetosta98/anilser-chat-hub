import { Home, MessageSquare, Book, Settings, BarChart3, Bot, Users, Shield } from "lucide-react";

export const regularUserMenuItems = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Base de Conhecimento",
    url: "/base-conhecimento",
    icon: Book,
  },
  {
    title: "Instruções do Chatbot",
    url: "/instrucoes-chatbot",
    icon: Bot,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Conexões",
    url: "/conexoes",
    icon: Shield,
  },
  {
    title: "Minha Conta",
    url: "/minha-conta",
    icon: Settings,
  },
];

export const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Usuários",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Minha Conta",
    url: "/minha-conta",
    icon: Settings,
  },
];
