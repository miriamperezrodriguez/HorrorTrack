
import { Button } from "@/components/ui/button";
import { useUserMovies, useUpdateUserMovie, useDeleteUserMovie } from "@/hooks/useMovies";
import { Trash2 } from "lucide-react";

export const PendingMovies = () => {
  const { data: userMovies = [], isLoading } = useUserMovies();
  const updateUserMovie = useUpdateUserMovie();
  const deleteUserMovie = useDeleteUserMovie();

  const pendingMovies = userMovies.filter(um => um.status === 'pending');

  const markAsWatched = (userMovieId: string) => {
    updateUserMovie.mutate({
      id: userMovieId,
      updates: { status: 'watched' }
    });
  };

  const removeMovie = (userMovieId: string) => {
    deleteUserMovie.mutate(userMovieId);
  };

  if (isLoading) {
    return <div className="text-white text-center">Cargando películas pendientes...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">Películas Pendientes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pendingMovies.map((userMovie) => (
          <div key={userMovie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={userMovie.movie.poster_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop"}
                alt={userMovie.movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{userMovie.movie.title}</h3>
                <p className="text-gray-300">{userMovie.movie.year}</p>
              </div>
              <Button
                onClick={() => removeMovie(userMovie.id)}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 p-2"
                disabled={deleteUserMovie.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <Button
                onClick={() => markAsWatched(userMovie.id)}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={updateUserMovie.isPending}
              >
                Marcar como Vista
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {pendingMovies.length === 0 && (
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
