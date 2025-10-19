import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'commerce' | 'motoboy';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Fallback to localStorage if Supabase not configured
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: 'commerce' | 'motoboy',
    profileData: any
  ) => {
    try {
      setError(null);
      setLoading(true);

      if (!supabase) {
        // Fallback to localStorage
        const localUser = {
          id: crypto.randomUUID(),
          email,
          role,
        };
        setUser(localUser);
        localStorage.setItem('user', JSON.stringify(localUser));
        localStorage.setItem(`${role}_${localUser.id}`, JSON.stringify(profileData));
        return { user: localUser, error: null };
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          role,
        });

      if (userError) throw userError;

      // Create role-specific profile
      if (role === 'commerce') {
        const { error: commerceError } = await supabase
          .from('commerces')
          .insert({
            user_id: authData.user.id,
            name: profileData.name,
            cnpj: profileData.cnpj,
            address: profileData.address,
            phone: profileData.phone,
          });

        if (commerceError) throw commerceError;
      } else {
        const { error: motoboyError } = await supabase
          .from('motoboys')
          .insert({
            user_id: authData.user.id,
            name: profileData.name,
            cpf: profileData.cpf,
            cnh: profileData.cnh,
            phone: profileData.phone,
            vehicle_plate: profileData.vehiclePlate,
            vehicle_type: profileData.vehicleType,
            is_active: true,
          });

        if (motoboyError) throw motoboyError;
      }

      const newUser = {
        id: authData.user.id,
        email,
        role,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { user: newUser, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setError(message);
      return { user: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      if (!supabase) {
        // Fallback to localStorage
        const stored = localStorage.getItem('user');
        if (stored) {
          const localUser = JSON.parse(stored);
          if (localUser.email === email) {
            setUser(localUser);
            return { user: localUser, error: null };
          }
        }
        throw new Error('Invalid credentials');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Failed to sign in');

      await loadUserProfile(data.user.id);

      return { user, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      return { user: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
}
