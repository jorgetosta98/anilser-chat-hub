
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Relatorios from "./pages/Relatorios";
import Conexoes from "./pages/Conexoes";
import MinhaConta from "./pages/MinhaConta";
import BaseConhecimento from "./pages/BaseConhecimento";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/chat" element={
              <ProtectedRoute>
                <AppLayout>
                  <Chat />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat/:chatId" element={
              <ProtectedRoute>
                <AppLayout>
                  <Chat />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <AppLayout>
                  <Relatorios />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/conexoes" element={
              <ProtectedRoute>
                <AppLayout>
                  <Conexoes />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/base-conhecimento" element={
              <ProtectedRoute>
                <AppLayout>
                  <BaseConhecimento />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/minha-conta" element={
              <ProtectedRoute>
                <AppLayout>
                  <MinhaConta />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/conversations" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/plans" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/minha-conta" element={
              <ProtectedRoute requireRole="admin">
                <AppLayout>
                  <AdminMinhaConta />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
