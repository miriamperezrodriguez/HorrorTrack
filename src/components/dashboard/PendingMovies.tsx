
import { useState } from "react";
import { Button } from "@/components/ui/button";

const pendingMovies = [
  {
    id: 3,
    title: "Hereditary",
    year: 2018,
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop"
  }
];

export const PendingMovies = () => {
  const [movedMovies, setMovedMovies] = useState<number[]>([]);

  const markAsWatched = (movieId: number) => {
    setMovedMovies(prev => [...prev, movieId]);
    // Aquí se actualizará en Supabase cuando esté conectado
    console.log(`Movie ${movieId} moved from pending to watched`);
  };

  const visibleMovies = pendingMovies.filter(movie => !movedMovies.includes(movie.id));

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">Películas Pendientes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleMovies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
                <p className="text-gray-300">{movie.year}</p>
              </div>
            </div>
            
            <div className="p-4">
              <Button
                onClick={() => markAsWatched(movie.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Marcar como Vista
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {visibleMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No tienes películas pendientes por ver.
          </p>
          <p className="text-gray-500 mt-2">
            Ve a la sección "Explorar" para agregar películas a tu lista.
          </p>
        </div>
      )}
    </div>
  );
};
