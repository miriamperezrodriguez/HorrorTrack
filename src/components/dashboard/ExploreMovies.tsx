
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMovies, useUserMovies, useAddUserMovie } from "@/hooks/useMovies";

const horrorGenres = [
  { id: "slasher", name: "Slasher" },
  { id: "supernatural", name: "Sobrenatural" },
  { id: "psychological", name: "Psicológico" },
  { id: "zombie", name: "Zombies" },
  { id: "vampire", name: "Vampiros" },
  { id: "ghost", name: "Fantasmas" }
];

export const ExploreMovies = () => {
  const [activeGenre, setActiveGenre] = useState("slasher");
  const { data: movies = [], isLoading } = useMovies();
  const { data: userMovies = [] } = useUserMovies();
  const addUserMovie = useAddUserMovie();

  const markMovie = (movieId: string, status: 'watched' | 'pending') => {
    addUserMovie.mutate({ movieId, status });
  };

  const getUserMovieStatus = (movieId: string) => {
    const userMovie = userMovies.find(um => um.movie_id === movieId);
    return userMovie?.status;
  };

  const filteredMovies = movies.filter(movie => movie.genre === activeGenre);

  if (isLoading) {
    return <div className="text-white text-center">Cargando películas...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">Explorar Películas</h2>
      
      <Tabs value={activeGenre} onValueChange={setActiveGenre} className="w-full">
        <TabsList className="grid grid-cols-6 bg-gray-800 mb-6">
          {horrorGenres.map((genre) => (
            <TabsTrigger 
              key={genre.id} 
              value={genre.id}
              className="data-[state=active]:bg-red-600"
            >
              {genre.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {horrorGenres.map((genre) => (
          <TabsContent key={genre.id} value={genre.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => {
                const status = getUserMovieStatus(movie.id);
                return (
                  <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="relative">
                      <img
                        src={movie.poster_url || "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=300&h=450&fit=crop"}
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
                      {status ? (
                        <div className="text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            status === 'watched' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-yellow-600 text-white'
                          }`}>
                            {status === 'watched' ? 'Vista' : 'Pendiente'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => markMovie(movie.id, 'watched')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={addUserMovie.isPending}
                          >
                            Marcar Vista
                          </Button>
                          <Button
                            onClick={() => markMovie(movie.id, 'pending')}
                            variant="outline"
                            className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                            disabled={addUserMovie.isPending}
                          >
                            Pendiente
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredMovies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No hay películas disponibles en este género.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
