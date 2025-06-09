
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MovieStats {
  movie_title: string;
  watch_count: number;
  avg_rating: number;
}

interface GenreStats {
  genre: string;
  avg_rating: number;
  movie_count: number;
  total_watches: number;
}

export const Statistics = () => {
  const { data: userStats, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1000);
      
      if (error) throw error;
      
      const totalUsers = data.length;
      
      const { data: watchedMovies, error: watchedError } = await supabase
        .from('user_movies')
        .select('id')
        .eq('status', 'watched');
        
      if (watchedError) throw watchedError;
      
      const totalWatched = watchedMovies.length;
      
      // Calcular promedio de calificaciones general
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('user_movies')
        .select('rating')
        .eq('status', 'watched')
        .not('rating', 'is', null);
        
      if (ratingsError) throw ratingsError;
      
      const avgRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, item) => sum + (item.rating || 0), 0) / ratingsData.length 
        : 0;
      
      return {
        totalUsers,
        totalWatched,
        avgRating: parseFloat(avgRating.toFixed(1))
      };
    }
  });

  const { data: movieStats, isLoading: loadingMovies } = useQuery({
    queryKey: ['admin-movie-stats-monthly'],
    queryFn: async () => {
      // Obtener fecha de inicio del mes actual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data, error } = await supabase
        .from('user_movies')
        .select(`
          rating,
          watched_at,
          movie:movies(title)
        `)
        .eq('status', 'watched')
        .gte('watched_at', startOfMonth.toISOString());
      
      if (error) throw error;
      
      // Agrupar por película
      const movieGroups: { [key: string]: { count: number; ratings: number[] } } = {};
      
      data.forEach((item) => {
        const title = item.movie?.title || 'Sin título';
        if (!movieGroups[title]) {
          movieGroups[title] = { count: 0, ratings: [] };
        }
        movieGroups[title].count++;
        if (item.rating) {
          movieGroups[title].ratings.push(item.rating);
        }
      });
      
      // Convertir a array y calcular estadísticas
      const stats: MovieStats[] = Object.entries(movieGroups).map(([title, data]) => ({
        movie_title: title,
        watch_count: data.count,
        avg_rating: data.ratings.length > 0 
          ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length 
          : 0
      }));
      
      // Ordenar por más vistas
      return stats.sort((a, b) => b.watch_count - a.watch_count);
    }
  });

  const { data: genreStats, isLoading: loadingGenres } = useQuery({
    queryKey: ['admin-genre-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_movies')
        .select(`
          rating,
          movie:movies(genre)
        `)
        .eq('status', 'watched');
      
      if (error) throw error;
      
      // Agrupar por género
      const genreGroups: { [key: string]: { ratings: number[]; totalWatches: number } } = {};
      
      data.forEach((item) => {
        const genre = item.movie?.genre || 'Sin género';
        if (!genreGroups[genre]) {
          genreGroups[genre] = { ratings: [], totalWatches: 0 };
        }
        genreGroups[genre].totalWatches++;
        if (item.rating) {
          genreGroups[genre].ratings.push(item.rating);
        }
      });
      
      // Convertir a array y calcular estadísticas
      const stats: GenreStats[] = Object.entries(genreGroups).map(([genre, data]) => ({
        genre,
        avg_rating: data.ratings.length > 0 
          ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length 
          : 0,
        movie_count: data.totalWatches,
        total_watches: data.totalWatches
      }));
      
      // Ordenar por calificación promedio
      return stats.sort((a, b) => b.avg_rating - a.avg_rating);
    }
  });

  if (loadingUsers || loadingMovies || loadingGenres) {
    return <div className="text-white text-center">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Usuarios</h3>
          <p className="text-3xl font-bold text-red-600">{userStats?.totalUsers || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Películas Vistas</h3>
          <p className="text-3xl font-bold text-green-600">{userStats?.totalWatched || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Calificación Promedio</h3>
          <p className="text-3xl font-bold text-yellow-600">{userStats?.avgRating || 0}/5</p>
        </div>
      </div>

      {/* Películas más vistas este mes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Películas Más Vistas Este Mes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">Película</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Veces Vista</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Calificación Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {movieStats?.slice(0, 10).map((stat, index) => (
                <tr key={stat.movie_title} className="text-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <span className="font-medium">{stat.movie_title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                      {stat.watch_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {stat.avg_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">
                          {'★'.repeat(Math.round(stat.avg_rating))}
                          {'☆'.repeat(5 - Math.round(stat.avg_rating))}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({stat.avg_rating.toFixed(1)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Sin calificar</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!movieStats?.length && (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay películas vistas este mes.</p>
          </div>
        )}
      </div>

      {/* Estadísticas por género */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Estadísticas por Género</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">Género</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Calificación Promedio</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Total Visualizaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {genreStats?.map((stat) => (
                <tr key={stat.genre} className="text-white">
                  <td className="px-4 py-3">
                    <span className="font-medium capitalize">{stat.genre}</span>
                  </td>
                  <td className="px-4 py-3">
                    {stat.avg_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">
                          {'★'.repeat(Math.round(stat.avg_rating))}
                          {'☆'.repeat(5 - Math.round(stat.avg_rating))}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({stat.avg_rating.toFixed(1)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Sin calificar</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                      {stat.total_watches}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!genreStats?.length && (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay datos de géneros disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};
