"use client";

import { useState } from "react";
import { ProductImage } from "@/domain/product/product";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted group">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-2 flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full shadow-md bg-card/80 backdrop-blur-sm hover:bg-card"
                onClick={prevImage}
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full shadow-md bg-card/80 backdrop-blur-sm hover:bg-card"
                onClick={nextImage}
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 snap-start overflow-hidden rounded-md bg-muted transition-all",
                currentIndex === index ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
              )}
              aria-label={`Voir l'image ${index + 1}`}
              aria-current={currentIndex === index}
            >
              <img
                src={image.url}
                alt={`Miniature ${image.alt}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
