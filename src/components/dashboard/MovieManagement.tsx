
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMovies } from "@/hooks/useMovies";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type HorrorGenre = Database['public']['Enums']['horror_genre'];

const horrorGenres: { id: HorrorGenre; name: string }[] = [
  { id: "slasher", name: "Slasher" },
  { id: "supernatural", name: "Sobrenatural" },
  { id: "psychological", name: "Psicológico" },
  { id: "zombie", name: "Zombies" },
  { id: "vampire", name: "Vampiros" },
  { id: "ghost", name: "Fantasmas" }
];

export const MovieManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState<{
    title: string;
    year: number;
    genre: HorrorGenre | '';
    description: string;
    poster_url: string;
  }>({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    description: '',
    poster_url: ''
  });

  const { data: movies = [], isLoading } = useMovies();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMovie = useMutation({
    mutationFn: async (movieData: typeof newMovie) => {
      const { data, error } = await supabase
        .from('movies')
        .insert([{
          title: movieData.title,
          year: movieData.year,
          genre: movieData.genre as HorrorGenre,
          description: movieData.description,
          poster_url: movieData.poster_url
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast({
        title: "Película agregada",
        description: "La película se ha agregado correctamente"
      });
      setNewMovie({
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        description: '',
        poster_url: ''
      });
      setShowAddForm(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar la película",
        variant: "destructive"
      });
    }
  });

  const deleteMovie = useMutation({
    mutationFn: async (movieId: string) => {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast({
        title: "Película eliminada",
        description: "La película se ha eliminado correctamente"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la película",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.genre) {
      toast({
        title: "Error",
        description: "Título y género son obligatorios",
        variant: "destructive"
      });
      return;
    }
    addMovie.mutate(newMovie);
  };

  if (isLoading) {
    return <div className="text-white text-center">Cargando películas...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700"
        >
          {showAddForm ? 'Cancelar' : 'Agregar Película'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Agregar Nueva Película</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Título *
                </label>
                <Input
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Año
                </label>
                <Input
                  type="number"
                  value={newMovie.year}
                  onChange={(e) => setNewMovie({...newMovie, year: parseInt(e.target.value)})}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1900"
                  max="2030"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Género *
              </label>
              <Select value={newMovie.genre} onValueChange={(value) => setNewMovie({...newMovie, genre: value as HorrorGenre})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  {horrorGenres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                URL del Póster
              </label>
              <Input
                value={newMovie.poster_url}
                onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Descripción
              </label>
              <Textarea
                value={newMovie.description}
                onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={addMovie.isPending}
              >
                Agregar Película
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-white font-semibold">Título</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Año</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Género</th>
                <th className="px-6 py-3 text-left text-white font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {movies.map((movie) => (
                <tr key={movie.id} className="text-white">
                  <td className="px-6 py-4 font-medium">{movie.title}</td>
                  <td className="px-6 py-4">{movie.year}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                      {horrorGenres.find(g => g.id === movie.genre)?.name || movie.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => deleteMovie.mutate(movie.id)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteMovie.isPending}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
