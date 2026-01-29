"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallback?: string;
};

export default function SafeImage({
  src,
  alt,
  fallback = PLACEHOLDER_IMAGE,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      src={hasError ? fallback : imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallback);
        }
      }}
    />
  );
}
