
-- Actualizar películas existentes con nuevos nombres y posters
UPDATE public.movies 
SET title = 'Expediente Warren', poster_url = 'https://pics.filmaffinity.com/Expediente_Warren_The_Conjuring-153245956-large.jpg'
WHERE title = 'The Conjuring';

UPDATE public.movies 
SET title = 'El Exorcista', poster_url = 'https://www.ecured.cu/images/8/80/El_exorcista_%28Pel%C3%ADcula%29.jpg'
WHERE title = 'The Exorcist';

UPDATE public.movies 
SET title = 'Psicosis', poster_url = 'https://www.mubis.es/media/covers/1307/1521/psicosis-portada-original.jpg'
WHERE title = 'Psycho';

UPDATE public.movies 
SET title = 'La Noche de los Muertos Vivientes', poster_url = 'https://lh6.googleusercontent.com/proxy/mw7Ho0YVB2otybVJO8MiU-zPbhi-Xlz76RxelPv14OzGrbQj00vwbp6aAdqLGfPKbqphck_qe1LVDlcfHjFz1Vx4iey3Ope8ReRMEEszWotHG9KfIQREImyKjWepUAJK9A'
WHERE title = 'Night of the Living Dead';

-- Actualizar posters de películas existentes
UPDATE public.movies 
SET poster_url = 'https://www.originalfilmart.com/cdn/shop/products/halloween_1978_linen_original_film_art_f_1200x.jpg?v=1583313063'
WHERE title = 'Halloween';

UPDATE public.movies 
SET poster_url = 'https://m.media-amazon.com/images/I/61slqVYrdwL._AC_UF894,1000_QL80_.jpg'
WHERE title = 'Scream';

UPDATE public.movies 
SET poster_url = 'https://lh3.googleusercontent.com/proxy/CVORT_kdZKCQDEQcgH09tz_7HELB72iWWUyl9bUq8o5nRKIWfkFrd5nLy2fwZuc4R5uf3bU4s_3EMcZKixf5FITjE0RYAo0M7m4cGdA'
WHERE title = 'The Ring';

UPDATE public.movies 
SET poster_url = 'https://pics.filmaffinity.com/dracula-128829492-large.jpg'
WHERE title = 'Dracula';

UPDATE public.movies 
SET poster_url = 'https://m.media-amazon.com/images/I/61ItdBIDDfL._AC_UF894,1000_QL80_.jpg'
WHERE title = 'Poltergeist';
