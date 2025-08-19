"use client";
import CategorySidebar from "@/components/CategorySidebar";
import ProductPreview from "@/components/ProductPreview";

export default function WallpapersPage() {
  const categories = [
    "ФОТОШПАЛЕРИ В ДИТЯЧУ",
    "ФОТОШПАЛЕРИ ДО ВІТАЛЬНІ",
    "ФОТОШПАЛЕРИ НА КУХНЮ",
    "3Д ФОТОШПАЛЕРИ",
    "ПРИРОДА",
    "КВІТИ",
  ];
  return (
    <div className="flex flex-row px-[clamp(1rem,6vw,7.5rem)] gap-y-20 xl:gap-y-30 py-4 lg:py-8">
      <CategorySidebar categories={categories} />
      <div className="grid w-full lg:ml-8 grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,2.5rem)]">
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
        <ProductPreview
          title="Казковий ліс"
          price="450 грн/м²"
          oldPrice="450 грн/м²"
        />
      </div>
    </div>
  );
}
