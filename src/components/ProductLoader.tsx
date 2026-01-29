"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductPreview from "@/components/ProductPreview";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { fetchProductsByCursor, ProductNode } from "@/app/wallpapers/action";

interface ProductLoaderProps {
  initialProducts: ProductNode[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
}

const ITEMS_PER_PAGE = 12;

export default function ProductLoader({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
}: ProductLoaderProps) {
  const [products, setProducts] = useState<ProductNode[]>(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreProducts = useCallback(async () => {
    if (!hasNextPage || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchProductsByCursor(ITEMS_PER_PAGE, endCursor);

      // Check for server-side error
      if (result.error) {
        setError("Не вдалося завантажити товари. Спробуйте ще раз.");
        return;
      }

      setProducts((prevProducts) => [...prevProducts, ...result.products]);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (err) {
      console.error("Error loading more products:", err);
      setError("Не вдалося завантажити товари. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  }, [hasNextPage, isLoading, endCursor]);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Start loading before reaching the bottom
        threshold: 0,
      }
    );

    // Observe the sentinel element
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isLoading, loadMoreProducts]);

  return (
    <>
      <div className="grid w-full grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,2.5rem)]">
        {products.map((product) => (
          <ProductPreview
            key={product.databaseId}
            title={product.name || "Без назви"}
            sku={product.sku || "N/A"}
            slug={product.slug || ""}
            price={`${product.salePrice ?? product.regularPrice ?? "N/A"} грн/м²`}
            oldPrice={
              product.salePrice && product.regularPrice !== product.salePrice
                ? `${product.regularPrice} грн/м²`
                : undefined
            }
            imageUrl={product.image?.sourceUrl || "/placeholder.jpg"}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadMoreProducts}
            className="px-6 py-3 bg-[#577C8E] text-white rounded-md hover:bg-[#4a6b7b] transition-colors"
          >
            Спробувати ще раз
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="mt-8">
          <ProductGridSkeleton count={6} />
        </div>
      )}

      {/* Sentinel element for infinite scroll */}
      {hasNextPage && !error && (
        <div
          ref={loadMoreRef}
          className="h-10 mt-8 flex justify-center items-center"
        >
          {/* Optional: Manual load button as fallback */}
          {!isLoading && (
            <button
              onClick={loadMoreProducts}
              className="px-6 py-3 bg-[#577C8E] text-white rounded-md hover:bg-[#4a6b7b] transition-colors opacity-50 hover:opacity-100"
            >
              Показати ще
            </button>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasNextPage && products.length > 0 && (
        <div className="mt-10 text-center text-gray-500">
          Показано всі {products.length} товарів
        </div>
      )}
    </>
  );
}
