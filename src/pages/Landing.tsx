
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HorrorCarousel } from "@/components/HorrorCarousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Carrusel de fondo */}
      <div className="absolute inset-0 z-0">
        <HorrorCarousel />
      </div>
      
      {/* Overlay oscuro para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>
      
      {/* Contenido principal */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 
          className="text-6xl md:text-8xl font-bold text-red-600 mb-8 drop-shadow-2xl"
          style={{ fontFamily: 'Another Danger, serif' }}
        >
          Bienvenidos a
        </h1>
        <h2 
          className="text-7xl md:text-9xl font-bold text-red-700 mb-12 drop-shadow-2xl"
          style={{ fontFamily: 'Another Danger, serif' }}
        >
          HORRORTRACK
        </h2>
        
        <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl leading-relaxed drop-shadow-lg">
          Tu registro personal de películas de terror. Lleva el control de lo que has visto, 
          califica tus favoritas y descubre nuevos sustos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            Iniciar Sesión
          </Button>
          <Button 
            onClick={() => navigate("/auth")}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-lg px-8 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
