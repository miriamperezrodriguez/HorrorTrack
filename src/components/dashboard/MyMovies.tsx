
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const watchedMovies = [
  {
    id: 1,
    title: "Scream",
    year: 1996,
    poster: "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=300&h=450&fit=crop",
    rating: 0
  },
  {
    id: 2,
    title: "Halloween",
    year: 1978,
    poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=450&fit=crop",
    rating: 0
  }
];

export const MyMovies = () => {
  const [movieRatings, setMovieRatings] = useState<Record<number, number>>({});

  const rateMovie = (movieId: number, rating: number) => {
    setMovieRatings(prev => ({
      ...prev,
      [movieId]: rating
    }));
    // Aquí se guardará en Supabase cuando esté conectado
    console.log(`Movie ${movieId} rated ${rating} stars`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">Mis Películas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watchedMovies.map((movie) => (
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
              <div className="mb-3">
                <div className="flex justify-center mb-2">
                  {renderStars(movieRatings[movie.id] || movie.rating)}
                </div>
              </div>
              
              <Select onValueChange={(value) => rateMovie(movie.id, parseInt(value))}>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Calificar película" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin calificación</SelectItem>
                  <SelectItem value="1">1 estrella</SelectItem>
                  <SelectItem value="2">2 estrellas</SelectItem>
                  <SelectItem value="3">3 estrellas</SelectItem>
                  <SelectItem value="4">4 estrellas</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
      
      {watchedMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Aún no has marcado ninguna película como vista.
          </p>
          <p className="text-gray-500 mt-2">
            Ve a la sección "Explorar" para empezar a marcar películas.
          </p>
        </div>
      )}
    </div>
  );
};
