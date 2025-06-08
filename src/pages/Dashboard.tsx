
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExploreMovies } from "@/components/dashboard/ExploreMovies";
import { MyMovies } from "@/components/dashboard/MyMovies";
import { PendingMovies } from "@/components/dashboard/PendingMovies";
import { WatchHistory } from "@/components/dashboard/WatchHistory";
import { UserProfile } from "@/components/dashboard/UserProfile";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("explore");

  const handleLogout = () => {
    // Implementar logout cuando Supabase esté conectado
    console.log("Logout functionality - requires Supabase");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/80 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 
            className="text-3xl font-bold text-red-600"
            style={{ fontFamily: 'Another Danger, serif' }}
          >
            HORRORTRACK
          </h1>
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
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
