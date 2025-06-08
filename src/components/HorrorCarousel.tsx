
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useState } from "react";

const horrorImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1520637836862-4d197d17c80a?w=800&h=600&fit=crop",
    title: "Horror Scene 1"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1509248961158-d3f231d2c4fb?w=800&h=600&fit=crop",
    title: "Horror Scene 2"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=800&h=600&fit=crop",
    title: "Horror Scene 3"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    title: "Horror Scene 4"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1520637836862-4d197d17c80a?w=800&h=600&fit=crop",
    title: "Horror Scene 5"
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
