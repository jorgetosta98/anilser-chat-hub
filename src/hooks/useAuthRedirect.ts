
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Só redirecionar se não estiver carregando e tiver usuário logado
    if (!loading && user && profile) {
      const currentPath = window.location.pathname;
      
      // Se estiver na página de auth e estiver logado, redirecionar
      if (currentPath === '/auth' || currentPath === '/') {
        if (profile.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/chat', { replace: true });
        }
      }
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
}
