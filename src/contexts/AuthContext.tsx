
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { signUpService, signInService, signOutService } from './auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, session, loading, setProfile } = useAuthState();

  const signUp = signUpService;
  const signIn = signInService;
  const signOut = signOutService;

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
