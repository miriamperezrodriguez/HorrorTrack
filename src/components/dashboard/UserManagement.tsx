
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithRole {
  id: string;
  username: string | null;
  created_at: string;
  role: string;
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Obtener perfiles de usuarios reales
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at');
      
      if (profilesError) {
        console.error('Error obteniendo perfiles:', profilesError);
        return [];
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Obtener roles para todos los usuarios
      const userIds = profiles.map(p => p.id);
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);
      
      if (rolesError) {
        console.error('Error obteniendo roles:', rolesError);
      }

      // Combinar los datos
      const usersWithRoles: UserWithRole[] = profiles.map(profile => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        return {
          id: profile.id,
          username: profile.username,
          created_at: profile.created_at,
          role: userRole?.role || 'user'
        };
      });

      return usersWithRoles;
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // First delete from profiles (cascade will handle user_roles)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    }
  });

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-white text-center">Cargando usuarios...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white max-w-md"
        />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-white font-semibold">Usuario</th>
                <th className="px-6 py-3 text-left text-white font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Rol</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Registro</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-white">
                  <td className="px-6 py-4">{user.username || 'Sin nombre'}</td>
                  <td className="px-6 py-4 font-mono text-sm">{user.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'superadmin' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'superadmin' && (
                      <Button
                        onClick={() => deleteUser.mutate(user.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteUser.isPending}
                      >
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron usuarios.</p>
        </div>
      )}
    </div>
  );
};
