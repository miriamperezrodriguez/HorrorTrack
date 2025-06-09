
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExploreMovies } from "@/components/dashboard/ExploreMovies";
import { MyMovies } from "@/components/dashboard/MyMovies";
import { PendingMovies } from "@/components/dashboard/PendingMovies";
import { WatchHistory } from "@/components/dashboard/WatchHistory";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      navigate("/");
    }
  };

  const isAdmin = userRole?.role === 'superadmin';

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-red-600 horror-title">
              HORRORTRACK
            </h1>
            {isAdmin && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                ADMIN
              </span>
            )}
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} bg-gray-800`}>
            <TabsTrigger value="explore" className="data-[state=active]:bg-red-600">
              Explorar
            </TabsTrigger>
            <TabsTrigger value="my-movies" className="data-[state=active]:bg-red-600">
              Mis Películas
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-red-600">
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-red-600">
              Historial
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-600">
              Mi Perfil
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-red-600">
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="explore" className="mt-6">
            <ExploreMovies />
          </TabsContent>

          <TabsContent value="my-movies" className="mt-6">
            <MyMovies />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <PendingMovies />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <WatchHistory />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <UserProfile />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <SuperAdminDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
