
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
      
      // Se estiver na página de auth e estiver logado, redirecionar
      if ((currentPath === '/auth' || currentPath === '/') && user && profile) {
        console.log('Redirecionando usuário logado:', profile.role);
        if (profile.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/chat', { replace: true });
        }
      }
      
      // Se não estiver logado e estiver em página protegida, redirecionar para auth
      if (!user && !['/auth', '/forgot-password', '/'].includes(currentPath)) {
        console.log('Redirecionando usuário não autenticado para /auth');
        navigate('/auth', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
