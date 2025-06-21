
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from './authUtils';

export const signUpService = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: 'admin' | 'client' = 'client', 
  company?: string
) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log('Sign out failed during cleanup:', err);
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const metadata: any = {
      full_name: fullName,
      role: role
    };
    
    if (company) {
      metadata.company = company;
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    
    return { error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error };
  }
};

export const signInService = async (email: string, password: string) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log('Sign out failed during cleanup:', err);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error };
  }
};

export const signOutService = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
    
    // Force page reload for a clean state
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
  } catch (error) {
    console.error('Error in signOut:', error);
    // Force navigation even if signOut fails
    window.location.href = '/auth';
  }
};
