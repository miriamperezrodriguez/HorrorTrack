
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Configurando listener de autenticación");

    // Listener para eventos customizados del superadmin
    const handleCustomAuthChange = (event: any) => {
      console.log("AuthProvider: Evento custom de auth", event.detail);
      const { session: newSession, event: authEvent } = event.detail;
      
      if (authEvent === 'SIGNED_IN') {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      } else if (authEvent === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    };

    window.addEventListener('supabase-auth-change', handleCustomAuthChange);

    // Set up auth state listener para usuarios normales
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthProvider: Cambio de estado de auth Supabase", { event, session: !!session });
        // Solo actualizar si no es una sesión de superadmin
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (!storedSession || !storedSession.includes('admin@horrortrack.com')) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    // Verificar sesión inicial
    const checkInitialSession = async () => {
      // Primero verificar si hay una sesión de superadmin almacenada
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session.user?.email === 'admin@horrortrack.com') {
            console.log("AuthProvider: Sesión de superadmin encontrada");
            setSession(session);
            setUser(session.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }

      // Si no hay sesión de superadmin, verificar sesión normal de Supabase
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AuthProvider: Sesión inicial de Supabase", { session: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkInitialSession();

    return () => {
      console.log("AuthProvider: Limpiando suscripciones");
      subscription.unsubscribe();
      window.removeEventListener('supabase-auth-change', handleCustomAuthChange);
    };
  }, []);

  console.log("AuthProvider: Estado actual", { user: !!user, loading });

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
