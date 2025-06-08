
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  poster_url?: string;
  description?: string;
}

export interface UserMovie {
  id: string;
  movie_id: string;
  status: 'watched' | 'pending';
  rating?: number;
  watched_at?: string;
  movie: Movie;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data as Movie[];
    }
  });
};

export const useUserMovies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-movies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_movies')
        .select(`
          *,
          movie:movies(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserMovie[];
    },
    enabled: !!user
  });
};

export const useAddUserMovie = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, status }: { movieId: string; status: 'watched' | 'pending' }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('user_movies')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          status,
          watched_at: status === 'watched' ? new Date().toISOString() : null
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movies'] });
      toast({
        title: "Película agregada",
        description: "La película se ha agregado correctamente"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo agregar la película",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateUserMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserMovie> }) => {
      const { data, error } = await supabase
        .from('user_movies')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          watched_at: updates.status === 'watched' ? new Date().toISOString() : undefined
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movies'] });
      toast({
        title: "Película actualizada",
        description: "Los cambios se han guardado correctamente"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la película",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteUserMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_movies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movies'] });
      toast({
        title: "Película eliminada",
        description: "La película se ha eliminado de tu lista"
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
};
