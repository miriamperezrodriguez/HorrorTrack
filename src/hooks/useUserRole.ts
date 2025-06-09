
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
      if (user.email === 'admin@horrortrack.com') {
        console.log("useUserRole: Detectado superadmin local");
        
        // Generar un UUID válido para el superadmin si es necesario
        const superadminUUID = '00000000-0000-0000-0000-000000000001';
        
        // Verificar si el rol de superadmin ya existe
        const { data: existingRole, error: fetchError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', superadminUUID)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.log("useUserRole: Error consultando rol:", fetchError);
        }
        
        if (!existingRole) {
          // Crear el rol de superadmin si no existe
          console.log("useUserRole: Creando rol de superadmin");
          const { data: newRole, error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: superadminUUID,
              role: 'superadmin'
            })
            .select()
            .single();
          
          if (insertError) {
            console.log("useUserRole: Error creando rol superadmin:", insertError);
          } else {
            console.log("useUserRole: Rol de superadmin creado exitosamente");
            return newRole as UserRole;
          }
        }
        
        return existingRole || {
          id: 'superadmin-role-id',
          user_id: superadminUUID,
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
