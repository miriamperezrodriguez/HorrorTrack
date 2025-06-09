
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "./UserManagement";
import { MovieManagement } from "./MovieManagement";
import { Statistics } from "./Statistics";

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6 horror-title">
        PANEL DE ADMINISTRACIÓN
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="movies" className="data-[state=active]:bg-red-600">
            Películas
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-red-600">
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="movies" className="mt-6">
          <MovieManagement />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Statistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
