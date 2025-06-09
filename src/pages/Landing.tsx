
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HorrorCarousel } from "@/components/HorrorCarousel";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HorrorCarousel />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-6 horror-title drop-shadow-2xl">
            HORRORTRACK
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tu plataforma definitiva para trackear películas de terror. 
            Descubre, organiza y califica las mejores películas del género más aterrador.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Comenzar Ahora
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16 horror-title">
            ¿Por qué HORRORTRACK?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-red-600 mb-3">Catálogo Extenso</h3>
              <p className="text-gray-300">
                Explora una amplia colección de películas de terror organizadas por género: 
                slasher, sobrenatural, psicológico y más.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-red-600 mb-3">Sistema de Calificación</h3>
              <p className="text-gray-300">
                Califica tus películas favoritas y lleva un registro detallado 
                de tus experiencias cinematográficas.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-red-600 mb-3">Seguimiento Personal</h3>
              <p className="text-gray-300">
                Mantén listas de películas vistas y pendientes. 
                Consulta tu historial y estadísticas personales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 horror-title">
            ¿Listo para sumergirte en el terror?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a la comunidad de amantes del cine de terror y comienza a trackear tus películas hoy.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-xl font-bold transition-all duration-300 transform hover:scale-105"
          >
            Unirse Gratis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
