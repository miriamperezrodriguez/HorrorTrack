
-- Actualizar The Ring a La Señal con nueva imagen
UPDATE public.movies 
SET title = 'La Señal', poster_url = 'https://xl.movieposterdb.com/05_05/2002/0298130/xl_18713_0298130_511f09e0.jpg'
WHERE title = 'The Ring';
