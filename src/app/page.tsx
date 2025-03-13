// Properly fixed page.tsx with balanced slide previews
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselPlayPause,
} from "@/components/carousel";
import LoadingScreen from "@/components/LoadingScreen";
import RotatedText from "@/components/RotatedText";
import type { AutoplayType } from "embla-carousel-autoplay";

// Updated image array with 4 images
const images = [
  { src: "/1.png", alt: "1st image" },
  { src: "/2.png", alt: "2nd image" },
  { src: "/3.png", alt: "3rd image" },
  { src: "/4.png", alt: "4th image" },
];

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef<AutoplayType>(null as unknown as AutoplayType);

  useEffect(() => {
    if (!api) return;
    autoplayRef.current = api.plugins().autoplay as ReturnType<typeof Autoplay>;

    // This is crucial: give the carousel time to initialize properly
    setTimeout(() => {
      api.reInit();
    }, 100);
  }, [api]);

  const togglePlayPause = () => {
    if (!autoplayRef.current) return;

    if (isPlaying) {
      autoplayRef.current.stop();
    } else {
      autoplayRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadComplete = () => {
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full relative overflow-hidden bg-white">
      {loading ? (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      ) : (
        <>
          {/* Brand Logo */}
          <div className="absolute top-8 left-8 z-10">
            <div className="border-2 border-black p-4 bg-white">
              <div className="text-3xl font-bold tracking-tighter leading-none">
                Dig
                <br />
                Drip
              </div>
            </div>
          </div>

          {/* Rotated Text - only visible on larger screens */}
          <div className="hidden lg:block">
            <RotatedText />
          </div>

          {/* Main Content with Enhanced Carousel */}
          <div className="w-full lg:w-2/3 h-screen ml-auto flex items-center justify-center px-4 lg:px-8">
            <div className="relative w-full max-w-lg">
              <Carousel
                className="w-full"
                opts={{
                  align: "center",
                  loop: true,
                  dragFree: true,
                  skipSnaps: false,
                  containScroll: false, // Important for loop visualization
                  slidesToScroll: 1,
                  startIndex: 0,
                }}
                setApi={setApi}
                plugins={[
                  Autoplay({
                    stopOnInteraction: false,
                    delay: 4000,
                  }),
                ]}
              >
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/2"
                    >
                      <div className="relative w-full h-[480px] overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                          priority={index === 0}
                        />
                        {/* Permanent light gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {/* Additional hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />

                <div className="absolute -bottom-12 w-full flex flex-col items-center gap-2 z-10">
                  <CarouselDots />

                  <CarouselPlayPause
                    autoplayRef={autoplayRef}
                    isPlaying={isPlaying}
                    onToggle={togglePlayPause}
                    className="mt-2"
                  />
                </div>
              </Carousel>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
