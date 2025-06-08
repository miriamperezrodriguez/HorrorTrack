
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const horrorGenres = [
  { id: "slasher", name: "Slasher" },
  { id: "supernatural", name: "Sobrenatural" },
  { id: "psychological", name: "Psicológico" },
  { id: "zombies", name: "Zombies" },
  { id: "vampires", name: "Vampiros" },
  { id: "ghosts", name: "Fantasmas" }
];

const sampleMovies = [
  {
    id: 1,
    title: "Scream",
    year: 1996,
    genre: "slasher",
    poster: "https://images.unsplash.com/photo-1489599735680-0b274d3aece0?w=300&h=450&fit=crop",
    status: null
  },
  {
    id: 2,
    title: "The Conjuring",
    year: 2013,
    genre: "supernatural",
    poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=450&fit=crop",
    status: null
  },
  {
    id: 3,
    title: "Hereditary",
    year: 2018,
    genre: "psychological",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    status: null
  }
];

export const ExploreMovies = () => {
  const [activeGenre, setActiveGenre] = useState("slasher");
  const [movieStatuses, setMovieStatuses] = useState<Record<number, string>>({});

  const markMovie = (movieId: number, status: 'watched' | 'pending') => {
    setMovieStatuses(prev => ({
      ...prev,
      [movieId]: status
    }));
    // Aquí se guardará en Supabase cuando esté conectado
    console.log(`Movie ${movieId} marked as ${status}`);
  };

  const filteredMovies = sampleMovies.filter(movie => movie.genre === activeGenre);

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
              {filteredMovies.map((movie) => (
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
                    {movieStatuses[movie.id] ? (
                      <div className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          movieStatuses[movie.id] === 'watched' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {movieStatuses[movie.id] === 'watched' ? 'Vista' : 'Pendiente'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => markMovie(movie.id, 'watched')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Marcar Vista
                        </Button>
                        <Button
                          onClick={() => markMovie(movie.id, 'pending')}
                          variant="outline"
                          className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                        >
                          Pendiente
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
