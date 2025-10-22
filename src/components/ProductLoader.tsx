"use client";

import { useState } from "react";
import ProductPreview from "@/components/ProductPreview";
import { fetchProductsByCursor, ProductNode } from "@/app/wallpapers/action";

interface ProductLoaderProps {
  initialProducts: ProductNode[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
}

const ITEMS_PER_PAGE = 1;

export default function ProductLoader({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
}: ProductLoaderProps) {
  const [products, setProducts] = useState<ProductNode[]>(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreProducts = async () => {
    if (!hasNextPage || isLoading) return;

    setIsLoading(true);
    const {
      products: newProducts,
      hasNextPage: newHasNextPage,
      endCursor: newEndCursor,
    } = await fetchProductsByCursor(ITEMS_PER_PAGE, endCursor);

    // Добавляем новые товары к существующему списку
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setHasNextPage(newHasNextPage);
    setEndCursor(newEndCursor);
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid w-full grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,2.5rem)]">
        {products.map((product) => (
          <ProductPreview
            key={product.databaseId}
            title={product.name || "Без назви"}
            sku={product.sku || "N/A"}
            slug={product.slug || ""}
            price={`${product.salePrice ?? "N/A"} грн/м²`}
            oldPrice={`${product.regularPrice} грн/м²`}
            imageUrl={product.image?.sourceUrl || "/placeholder.jpg"}
          />
        ))}
      </div>

      {/* Кнопка "Загрузить ещё" */}
      <div className="mt-10 flex justify-center">
        {hasNextPage && (
          <button
            onClick={loadMoreProducts}
            disabled={isLoading}
            className="px-6 py-3 bg-[#577C8E] text-white rounded-md hover:bg-[#4a6b7b] transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Загрузка..." : "Показати ще"}
          </button>
        )}
      </div>
    </>
  );
}
