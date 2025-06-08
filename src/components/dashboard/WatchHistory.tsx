
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const watchHistoryData = [
  {
    id: 1,
    title: "Scream",
    year: 1996,
    rating: 4,
    watchedDate: "2024-01-15",
    poster: "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=100&h=150&fit=crop"
  },
  {
    id: 2,
    title: "Halloween",
    year: 1978,
    rating: 5,
    watchedDate: "2024-01-10",
    poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=150&fit=crop"
  },
  {
    id: 3,
    title: "The Conjuring",
    year: 2013,
    rating: 3,
    watchedDate: "2024-01-05",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=150&fit=crop"
  }
];

export const WatchHistory = () => {
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedHistory = [...watchHistoryData].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.watchedDate).getTime();
      const dateB = new Date(b.watchedDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === "desc" 
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
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
        {sortedHistory.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{movie.title}</h3>
              <p className="text-gray-400">{movie.year}</p>
              <p className="text-gray-500 text-sm">Visto el {formatDate(movie.watchedDate)}</p>
            </div>
            
            <div className="text-right">
              <div className="flex justify-end mb-1">
                {renderStars(movie.rating)}
              </div>
              <p className="text-gray-400 text-sm">{movie.rating}/5</p>
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
