"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      containScroll: "trimSnaps",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    const slides = api.slideNodes();
    slides.forEach((slide, index) => {
      const isSelected = index === api.selectedScrollSnap();
      slide.style.zIndex = isSelected ? "10" : "1";
      slide.style.opacity = isSelected ? "1" : "0.5";
      slide.style.transition = "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
      slide.style.transform = isSelected ? "scale(1)" : "scale(0.9)";
    });
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    api.on("scroll", onSelect);

    return () => {
      api?.off("select", onSelect);
      api?.off("scroll", onSelect);
      api?.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={`relative ${className || ""}`}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={`flex ${orientation === "horizontal" ? "" : "flex-col"} ${
          className || ""
        }`}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={`min-w-0 shrink-0 grow-0 basis-full md:basis-4/5 lg:basis-3/4 p-2 md:p-4 transition-all duration-500 ease-in-out ${
        orientation === "horizontal" ? "" : "py-4"
      } ${className || ""}`}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      className={`absolute w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/30 z-10 ${
        orientation === "horizontal"
          ? "top-1/2 -translate-y-1/2 left-1"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90"
      } ${canScrollPrev ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
        className || ""
      }`}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="w-5 h-5 mx-auto text-white" />
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<"button">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      className={`absolute w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/30 z-10 ${
        orientation === "horizontal"
          ? "top-1/2 -translate-y-1/2 right-1"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"
      } ${canScrollNext ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
        className || ""
      }`}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="w-5 h-5 mx-auto text-white" />
      <span className="sr-only">Next slide</span>
    </button>
  );
}

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setSlideCount(api.slideNodes().length);
    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div
      className={`flex gap-2 justify-center mt-2 ${className || ""}`}
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <button
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            selectedIndex === index ? "w-8 bg-gray-300" : "w-2 bg-gray-400/50"
          }`}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

function CarouselPlayPause({
  className,
  autoplayRef,
  isPlaying,
  onToggle,
  ...props
}: React.ComponentProps<"button"> & {
  autoplayRef: React.RefObject<ReturnType<typeof Autoplay>>;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-300 ${
        className || ""
      }`}
      onClick={onToggle}
      {...props}
    >
      {isPlaying ? (
        <>
          <Pause size={16} />
          <span>Pause</span>
        </>
      ) : (
        <>
          <Play size={16} />
          <span>Play</span>
        </>
      )}
    </button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselPlayPause,
};
