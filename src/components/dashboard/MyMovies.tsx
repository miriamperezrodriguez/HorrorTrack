
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserMovies, useUpdateUserMovie } from "@/hooks/useMovies";

export const MyMovies = () => {
  const { data: userMovies = [], isLoading } = useUserMovies();
  const updateUserMovie = useUpdateUserMovie();

  const watchedMovies = userMovies.filter(um => um.status === 'watched');

  const rateMovie = (userMovieId: string, rating: number) => {
    updateUserMovie.mutate({
      id: userMovieId,
      updates: { rating }
    });
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

  if (isLoading) {
    return <div className="text-white text-center">Cargando tus películas...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">Mis Películas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watchedMovies.map((userMovie) => (
          <div key={userMovie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={userMovie.movie.poster_url || "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=300&h=450&fit=crop"}
                alt={userMovie.movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{userMovie.movie.title}</h3>
                <p className="text-gray-300">{userMovie.movie.year}</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <div className="flex justify-center mb-2">
                  {renderStars(userMovie.rating || 0)}
                </div>
              </div>
              
              <Select 
                value={userMovie.rating?.toString() || "0"} 
                onValueChange={(value) => rateMovie(userMovie.id, parseInt(value))}
              >
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
