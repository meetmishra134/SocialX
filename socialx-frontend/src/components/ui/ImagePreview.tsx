import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

interface ImagePreviewProps {
  images: string[];
  isFullScreen?: boolean;
  initialIndex?: number;
  onClose?: () => void;
  onImageClick?: (index: number) => void;
}

export default function ImagePreview({
  images,
  isFullScreen = false,
  initialIndex = 0,

  onImageClick,
}: ImagePreviewProps) {
  if (!images || images.length === 0) return null;

  return (
    <div
      className={`w-full overflow-hidden ${isFullScreen ? "" : "border-border bg-muted/30 rounded-xl border"}`}
    >
      <AnimatePresence mode="popLayout">
        {images.length === 1 ? (
          <SingleImagePreview
            key="single"
            src={images[0]}
            isFullScreen={isFullScreen}
            onImageClick={onImageClick}
          />
        ) : (
          <ImageCarousel
            key="carousel"
            images={images}
            isFullScreen={isFullScreen}
            initialIndex={initialIndex}
            onImageClick={onImageClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface SingleImageProps extends Pick<
  ImagePreviewProps,
  "isFullScreen" | "onImageClick"
> {
  src: string;
}

function SingleImagePreview({
  src,
  isFullScreen,
  onImageClick,
}: SingleImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, ...(isFullScreen ? {} : { y: 10 }) }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: isFullScreen ? 1 : 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative w-full overflow-hidden ${isFullScreen ? "flex h-full items-center justify-center p-4 sm:p-6 md:p-10" : "group aspect-video cursor-pointer"}`}
      onClick={() => !isFullScreen && onImageClick?.(0)}
    >
      <motion.img
        src={src}
        alt="Preview"
        className={`${isFullScreen ? "max-h-full max-w-full" : "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"}`}
      />
      {!isFullScreen && (
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      )}
    </motion.div>
  );
}

type CarouselProps = Pick<
  ImagePreviewProps,
  "images" | "isFullScreen" | "initialIndex" | "onImageClick"
>;

function ImageCarousel({
  images,
  isFullScreen,
  initialIndex,
  onImageClick,
}: CarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useEffect(() => {
    if (!api) return;

    const syncCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", syncCurrentIndex);
    api.on("reInit", syncCurrentIndex);

    return () => {
      api.off("select", syncCurrentIndex);
      api.off("reInit", syncCurrentIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !isFullScreen || initialIndex === undefined) return;

    api.scrollTo(initialIndex, true);
  }, [api, isFullScreen, initialIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative w-full overflow-hidden ${isFullScreen ? "h-full" : "rounded-xl"}`}
    >
      <Carousel
        setApi={setApi}
        className={`group w-full ${isFullScreen ? "flex h-full items-center" : ""}`}
      >
        <CarouselContent className={`${isFullScreen ? "h-full" : ""}`}>
          {images.map((src, index) => (
            <CarouselItem
              key={index}
              className={`${isFullScreen ? "flex h-full items-center justify-center" : ""}`}
            >
              <div
                className={`relative w-full overflow-hidden ${isFullScreen ? "flex h-full max-h-full items-center justify-center" : "aspect-video cursor-pointer"}`}
                onClick={() => !isFullScreen && onImageClick?.(index)}
              >
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className={`${isFullScreen ? "max-h-[90vh] max-w-full object-contain" : "h-full w-full object-cover"}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={`bg-background/80 hover:bg-background absolute top-1/2 left-2 z-50 -translate-y-1/2 backdrop-blur-sm transition-opacity duration-300 sm:left-4 ${
            isFullScreen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
        <CarouselNext
          className={`bg-background/80 hover:bg-background absolute top-1/2 right-2 z-50 -translate-y-1/2 backdrop-blur-sm transition-opacity duration-300 sm:right-4 ${
            isFullScreen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />

        <div
          className={`absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md`}
        >
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/70"}`}
            />
          ))}
        </div>
      </Carousel>
    </motion.div>
  );
}
