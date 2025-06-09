
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  session?: Session;
}

// Credenciales de superadmin
const SUPERADMIN_EMAIL = "miriamisonfireart@gmail.com";
const SUPERADMIN_PASSWORD = "130896";

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
    console.log("Auth: Credenciales de superadmin detectadas");
    
    // Intentar iniciar sesión directamente
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (data?.user) {
      console.log("Auth: Login de superadmin exitoso");
      
      // Asegurar que tiene rol de superadmin
      try {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: data.user.id,
            role: 'superadmin'
          });
        console.log("Auth: Rol de superadmin asignado/actualizado");
      } catch (roleError) {
        console.log("Auth: Error asignando rol de superadmin:", roleError);
      }
      
      return { data, error: null };
    }
    
    if (error) {
      console.log("Auth: Error en login de superadmin, intentando crear cuenta");
      
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
        console.log("Auth: Error creando superadmin:", signUpError);
        return { data: null, error: signUpError };
      }
      
      // Asignar rol de superadmin
      if (signUpData.user) {
        try {
          await supabase
            .from('user_roles')
            .upsert({
              user_id: signUpData.user.id,
              role: 'superadmin'
            });
          console.log("Auth: Superadmin creado con rol asignado");
        } catch (roleError) {
          console.log("Auth: Error asignando rol al nuevo superadmin:", roleError);
        }
      }
      
      return { data: signUpData, error: null };
    }
  }
  
  // Inicio de sesión normal
  console.log("Auth: Login normal");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  console.log("Auth: Resultado login normal:", { user: !!data?.user, error: !!error });
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
