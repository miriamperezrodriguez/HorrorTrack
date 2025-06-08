
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUserMovies } from "@/hooks/useMovies";
import { useAuth } from "@/contexts/AuthContext";

const defaultAvatarUrl = "https://wallpapercave.com/wp/wp14632558.jpg";

export const UserProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: userMovies = [] } = useUserMovies();
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: defaultAvatarUrl
  });

  // Actualizar formData cuando se carga el perfil
  useState(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        avatar_url: profile.avatar_url || defaultAvatarUrl
      });
    }
  });

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      avatar_url: profile?.avatar_url || defaultAvatarUrl
    });
    setIsEditing(false);
  };

  const watchedMovies = userMovies.filter(um => um.status === 'watched');
  const pendingMovies = userMovies.filter(um => um.status === 'pending');
  const ratedMovies = watchedMovies.filter(um => um.rating && um.rating > 0);
  const averageRating = ratedMovies.length > 0 
    ? (ratedMovies.reduce((sum, um) => sum + (um.rating || 0), 0) / ratedMovies.length).toFixed(1)
    : '0';

  if (isLoading) {
    return <div className="text-white text-center">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-red-600 mb-6">Mi Perfil</h2>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={profile?.avatar_url || defaultAvatarUrl}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">
              {profile?.username || 'Usuario'}
            </h3>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">Nombre de usuario</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div>
            <Label htmlFor="avatar" className="text-white">URL de foto de perfil</Label>
            <Input
              id="avatar"
              value={formData.avatar_url}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
              disabled={!isEditing}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="URL de tu foto de perfil"
            />
          </div>

          <div className="flex gap-4 pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updateProfile.isPending}
                >
                  Guardar Cambios
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Estadísticas</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-red-500">{watchedMovies.length}</p>
              <p className="text-gray-400 text-sm">Películas Vistas</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-yellow-500">{pendingMovies.length}</p>
              <p className="text-gray-400 text-sm">Pendientes</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-500">{averageRating}</p>
              <p className="text-gray-400 text-sm">Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
