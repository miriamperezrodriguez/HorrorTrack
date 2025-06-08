
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "Usuario",
    email: "usuario@example.com",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    // Aquí se guardará en Supabase cuando esté conectado
    console.log("Profile updated:", formData);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-red-600 mb-6">Mi Perfil</h2>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={profileData.profileImage}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditing && (
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-red-600 hover:bg-red-700"
              >
                ✎
              </Button>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
            <p className="text-gray-400">{profileData.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="bg-gray-700 border-gray-600 text-white"
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
              <p className="text-2xl font-bold text-red-500">15</p>
              <p className="text-gray-400 text-sm">Películas Vistas</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-yellow-500">3</p>
              <p className="text-gray-400 text-sm">Pendientes</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-500">4.2</p>
              <p className="text-gray-400 text-sm">Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
