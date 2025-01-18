import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Welcome to Our Platform",
    description: "Discover amazing features and content",
    image: "../",
  },
  {
    title: "Explore New Possibilities",
    description: "Find what you're looking for",
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0",
  },
  {
    title: "Stay Connected",
    description: "Join our community today",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="relative overflow-hidden  border-0">
      <CardContent className="p-0">
        <div className="relative h-[300px] sm:h-[200px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={slide.image} alt={slide.title} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white p-6 max-w-2xl">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 swiper-title">{slide.title}</h2>
                  <p className="text-lg sm:text-xl mb-6 swiper-title">{slide.description}</p>
                  <Button variant="secondary" size="lg" className="swiper-title">
                    Join Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          onClick={previousSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button> */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button> */}
      </CardContent>
    </Card>
  );
}
