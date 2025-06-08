
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserMovies } from "@/hooks/useMovies";

export const WatchHistory = () => {
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { data: userMovies = [], isLoading } = useUserMovies();

  const watchedMovies = userMovies.filter(um => um.status === 'watched' && um.watched_at);

  const sortedHistory = [...watchedMovies].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.watched_at!).getTime();
      const dateB = new Date(b.watched_at!).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === "desc" 
        ? b.movie.title.localeCompare(a.movie.title)
        : a.movie.title.localeCompare(b.movie.title);
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-white text-center">Cargando historial...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-red-600">Historial de Películas</h2>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(value: "date" | "title") => setSortBy(value)}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Por Fecha</SelectItem>
              <SelectItem value="title">Por Título</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            {sortOrder === "desc" ? "↓" : "↑"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedHistory.map((userMovie) => (
          <div key={userMovie.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <img
              src={userMovie.movie.poster_url || "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=100&h=150&fit=crop"}
              alt={userMovie.movie.title}
              className="w-16 h-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{userMovie.movie.title}</h3>
              <p className="text-gray-400">{userMovie.movie.year}</p>
              <p className="text-gray-500 text-sm">
                Visto el {formatDate(userMovie.watched_at!)}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex justify-end mb-1">
                {renderStars(userMovie.rating || 0)}
              </div>
              <p className="text-gray-400 text-sm">{userMovie.rating || 0}/5</p>
            </div>
          </div>
        ))}
      </div>
      
      {sortedHistory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Tu historial está vacío.
          </p>
          <p className="text-gray-500 mt-2">
            Las películas que marques como vistas aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  );
};
