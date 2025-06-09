
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  session?: Session;
}

// Credenciales de superadmin
const SUPERADMIN_EMAIL = "superadmin@horrortrack.com";
const SUPERADMIN_PASSWORD = "HorrorTrack2024!Admin";

export const signUp = async (email: string, password: string, username?: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        username: username || email.split('@')[0]
      }
    }
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  // Verificar si son credenciales de superadmin
  if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
    // Intentar iniciar sesión con superadmin
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      // Si el superadmin no existe, crearlo
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: SUPERADMIN_EMAIL,
        password: SUPERADMIN_PASSWORD,
        options: {
          data: {
            username: 'SuperAdmin'
          }
        }
      });
      
      if (signUpError) {
        return { data: null, error: signUpError };
      }
      
      // Asignar rol de superadmin
      if (signUpData.user) {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: signUpData.user.id,
            role: 'superadmin'
          });
      }
      
      return { data: signUpData, error: null };
    }
    
    // Asegurar que tiene rol de superadmin
    if (data.user) {
      await supabase
        .from('user_roles')
        .upsert({
          user_id: data.user.id,
          role: 'superadmin'
        });
    }
    
    return { data, error };
  }
  
  // Inicio de sesión normal
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
