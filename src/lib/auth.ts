
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  session?: Session;
}

// Credenciales de superadmin - usando email ficticio
const SUPERADMIN_EMAIL = "admin@horrortrack.com";
const SUPERADMIN_PASSWORD = "admin123";
const SUPERADMIN_UUID = "00000000-0000-0000-0000-000000000001";

// Usuario ficticio para el superadmin
const SUPERADMIN_USER = {
  id: SUPERADMIN_UUID,
  email: SUPERADMIN_EMAIL,
  user_metadata: { username: "SuperAdmin" },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as User;

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
  console.log("Auth: Intentando login con", email);
  
  // Verificar si son credenciales de superadmin
  if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
    console.log("Auth: Credenciales de superadmin detectadas - creando sesión local");
    
    // Crear una sesión ficticia para el superadmin
    const fakeSession = {
      access_token: "fake-superadmin-token",
      refresh_token: "fake-refresh-token",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: SUPERADMIN_USER
    } as Session;
    
    // Almacenar la sesión en localStorage para persistencia
    localStorage.setItem('supabase.auth.token', JSON.stringify(fakeSession));
    
    // Disparar el evento de autenticación manualmente
    window.dispatchEvent(new CustomEvent('supabase-auth-change', {
      detail: { session: fakeSession, event: 'SIGNED_IN' }
    }));
    
    return { 
      data: { 
        user: SUPERADMIN_USER, 
        session: fakeSession 
      }, 
      error: null 
    };
  }
  
  // Inicio de sesión normal con Supabase
  console.log("Auth: Login normal");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  console.log("Auth: Resultado login normal:", { user: !!data?.user, error: !!error });
  return { data, error };
};

export const signOut = async () => {
  // Limpiar sesión de superadmin si existe
  const storedSession = localStorage.getItem('supabase.auth.token');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      if (session.user?.email === SUPERADMIN_EMAIL) {
        localStorage.removeItem('supabase.auth.token');
        window.dispatchEvent(new CustomEvent('supabase-auth-change', {
          detail: { session: null, event: 'SIGNED_OUT' }
        }));
        return { error: null };
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  // Verificar si hay una sesión de superadmin
  const storedSession = localStorage.getItem('supabase.auth.token');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      if (session.user?.email === SUPERADMIN_EMAIL) {
        return session.user;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  // Verificar si hay una sesión de superadmin
  const storedSession = localStorage.getItem('supabase.auth.token');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      if (session.user?.email === SUPERADMIN_EMAIL) {
        return session;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
