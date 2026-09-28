"use client";

import { useState } from "react";
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

type ImageLightboxProps = {
  images: SlideImage[];
  label?: string;
};

export function ImageLightbox({
  images,
  label = "Gallery",
}: ImageLightboxProps) {
  const [index, setIndex] = useState(-1);
  const visibleImages = images.slice(0, 3);
  const remainingCount = images.length - visibleImages.length;
  const buttonClassName =
    "relative size-12 shrink-0 overflow-hidden rounded-md border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (images.length === 0) {
    return <span className="text-sm text-muted-foreground">No images</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      {visibleImages.map((image, imageIndex) => (
        <button
          key={`${image.src}-${imageIndex}`}
          type="button"
          className={buttonClassName}
          aria-label={`View ${label} image ${imageIndex + 1} of ${images.length}${imageIndex === 2 && remainingCount > 0 ? `, ${remainingCount} more images` : ""}`}
          aria-haspopup="dialog"
          onClick={() => setIndex(imageIndex)}
        >
          {/* Uploaded image URLs may come from external storage providers. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt ?? `${label} image ${imageIndex + 1}`}
            width={48}
            height={48}
            loading="lazy"
            className="size-full object-cover transition-opacity hover:opacity-80"
          />
          {imageIndex === 2 && remainingCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-gray-200/75 text-sm font-semibold text-gray-900"
            >
              +{remainingCount}
            </span>
          )}
        </button>
      ))}
      {index >= 0 && (
        <Lightbox
          open
          close={() => setIndex(-1)}
          index={index}
          slides={images}
          plugins={[Counter]}
        />
      )}
    </div>
  );
}
