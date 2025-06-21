
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Chat from "./pages/Chat";
import Relatorios from "./pages/Relatorios";
import Conexoes from "./pages/Conexoes";
import MinhaConta from "./pages/MinhaConta";
import BaseConhecimento from "./pages/BaseConhecimento";
import Personalizacao from "./pages/Personalizacao";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AdminMinhaConta from "./pages/AdminMinhaConta";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full overflow-hidden">
    <AppSidebar />
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={
            <AppLayout>
              <Chat />
            </AppLayout>
          } />
          <Route path="/chat" element={
            <AppLayout>
              <Chat />
            </AppLayout>
          } />
          <Route path="/chat/:chatId" element={
            <AppLayout>
              <Chat />
            </AppLayout>
          } />
          <Route path="/relatorios" element={
            <AppLayout>
              <Relatorios />
            </AppLayout>
          } />
          <Route path="/conexoes" element={
            <AppLayout>
              <Conexoes />
            </AppLayout>
          } />
          <Route path="/base-conhecimento" element={
            <AppLayout>
              <BaseConhecimento />
            </AppLayout>
          } />
          <Route path="/personalizacao" element={
            <AppLayout>
              <Personalizacao />
            </AppLayout>
          } />
          <Route path="/minha-conta" element={
            <AppLayout>
              <MinhaConta />
            </AppLayout>
          } />
          <Route path="/admin" element={
            <AppLayout>
              <Admin />
            </AppLayout>
          } />
          <Route path="/admin/users" element={
            <AppLayout>
              <Admin />
            </AppLayout>
          } />
          <Route path="/admin/conversations" element={
            <AppLayout>
              <Admin />
            </AppLayout>
          } />
          <Route path="/admin/settings" element={
            <AppLayout>
              <Admin />
            </AppLayout>
          } />
          <Route path="/admin/plans" element={
            <AppLayout>
              <Admin />
            </AppLayout>
          } />
          <Route path="/admin/minha-conta" element={
            <AppLayout>
              <AdminMinhaConta />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
