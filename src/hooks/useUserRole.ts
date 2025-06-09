
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'user' | 'superadmin';
  created_at: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Verificar si es el superadmin local
      if (user.email === 'admin@horrortrack.com' && user.id === 'superadmin-id') {
        console.log("useUserRole: Detectado superadmin local");
        return {
          id: 'superadmin-role-id',
          user_id: user.id,
          role: 'superadmin' as const,
          created_at: new Date().toISOString()
        } as UserRole;
      }
      
      // Para usuarios normales, consultar la base de datos
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.log("useUserRole: Error o usuario sin rol en BD:", error.message);
        // Si no tiene rol en la BD, asignar rol de usuario por defecto
        return {
          id: 'default-user-role',
          user_id: user.id,
          role: 'user' as const,
          created_at: new Date().toISOString()
        } as UserRole;
      }
      
      return data as UserRole;
    },
    enabled: !!user
  });
};
