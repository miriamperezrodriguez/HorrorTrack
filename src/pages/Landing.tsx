
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HorrorCarousel } from "@/components/HorrorCarousel";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-red-600">HorrorTrack</h1>
            <div className="space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-red-600 hover:bg-red-700"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6 text-red-600">
            Seguimiento de Películas de Terror
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Lleva un registro de todas las películas de terror que has visto, 
            califica tus favoritas y descubre nuevos títulos que te harán temblar.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3"
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-red-600">
            Características
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Seguimiento de Películas</h4>
              <p className="text-gray-400">
                Marca las películas que has visto y mantén una lista de pendientes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Calificaciones</h4>
              <p className="text-gray-400">
                Califica tus películas favoritas y lleva un registro de las mejores.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Historial</h4>
              <p className="text-gray-400">
                Revisa tu historial completo de películas vistas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horror Movies Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-red-600">
            Películas Destacadas
          </h3>
          <HorrorCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-red-600">
            ¿Listo para el Terror?
          </h3>
          <p className="text-xl mb-8 text-gray-300">
            Únete a nuestra comunidad de amantes del terror y comienza a rastrear tus películas favoritas.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3"
          >
            Crear Cuenta Gratis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 HorrorTrack. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
