
import { User, Session } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'client', company?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}
