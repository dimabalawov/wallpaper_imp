import React from "react";
import Image from "next/image";

interface CategoryPreviewProps {
  title: string;
  imageUrl?: string;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({
  title,
  imageUrl,
}) => {
  return (
    <div className="w-full aspect-[16/9] md:aspect-[4/3] bg-mock rounded-xl flex items-center justify-center text-xl lg:text-2xl font-semibold text-black relative overflow-hidden">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          {/* Replace <img> with Next.js <Image> for category image */}
          <Image
            src={imageUrl}
            alt={title}
            width={120}
            height={120}
            className="mb-4"
          />
        </>
      )}
      <span className="relative z-10 uppercase tracking-wide">{title}</span>
    </div>
  );
};

export default CategoryPreview;
