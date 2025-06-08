
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useState } from "react";

const horrorImages = [
  {
    id: 1,
    url: "https://i0.wp.com/blog.heroesdepapel.es/wp-content/uploads/2021/09/freddykrueger.png?resize=1024%2C576&ssl=1",
    title: "Freddy Krueger"
  },
  {
    id: 2,
    url: "https://cuatrobastardosdotcom.wordpress.com/wp-content/uploads/2016/05/6137990b60940e20.jpg?w=960",
    title: "Horror Scene 2"
  },
  {
    id: 3,
    url: "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/cinefilia/hereditary-pelicula-terror-analisis/138110827-1-esl-ES/Por-que-Hereditary-es-lo-mas-terrorifico-que-veras-este-ano.jpg?resize=640:*",
    title: "Hereditary"
  },
  {
    id: 4,
    url: "https://media.timeout.com/images/103691714/750/422/image.jpg",
    title: "Horror Scene 4"
  },
  {
    id: 5,
    url: "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/peliculas/posesion-infernal-evil-dead/galeria/6255974-3-esl-ES/Posesion-infernal-Evil-Dead.jpg",
    title: "Evil Dead"
  }
];

export const HorrorCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % horrorImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative">
      {horrorImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {horrorImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-red-600' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
