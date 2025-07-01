
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Só redirecionar se não estiver carregando
    if (!loading) {
      const currentPath = window.location.pathname;
      const keepLoggedIn = localStorage.getItem('keepLoggedIn') === 'true';
      
      // Se estiver na página raiz (/) e estiver logado, redirecionar
      if (currentPath === '/' && user && profile) {
        console.log('Redirecionando usuário logado:', profile.role);
        if (profile.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/chat', { replace: true });
        }
      }
      
      // Se não estiver logado e estiver em página protegida, redirecionar para auth
      // Mas apenas se não tiver a opção "manter conectado"
      if (!user && !['/auth', '/forgot-password', '/'].includes(currentPath)) {
        if (!keepLoggedIn) {
          console.log('Redirecionando usuário não autenticado para /auth');
          navigate('/auth', { replace: true });
        }
      }
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
