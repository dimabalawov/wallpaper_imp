import CategorySidebar from "@/components/CategorySidebar";
import ProductLoader from "@/components/ProductLoader";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { sdk } from "@/lib/api";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

type ProductNode = {
  databaseId: number;
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  salePrice?: string | null;
  regularPrice?: string | null;
  image?: {
    sourceUrl?: string | null;
  } | null;
};

async function getWallpapersData(): Promise<{
  products: ProductNode[];
  hasNextPage: boolean;
  endCursor: string | null;
  error: string | null;
}> {
  try {
    const initialData = await sdk.ProductsPaginated({
      first: ITEMS_PER_PAGE,
      after: null,
    });

    return {
      products: (initialData.products?.nodes as ProductNode[]) || [],
      hasNextPage: initialData.products?.pageInfo?.hasNextPage || false,
      endCursor: initialData.products?.pageInfo?.endCursor || null,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching wallpapers:", error);
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
      error: "Не вдалося завантажити товари. Спробуйте оновити сторінку.",
    };
  }
}

export default async function WallpapersPage() {
  const { products, hasNextPage, endCursor, error } = await getWallpapersData();

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

      <div className="flex flex-col w-full lg:ml-8">
        <h2 className="text-black font-semibold text-2xl md:text-3xl mb-8 lg:mb-10">
          Фотошпалери
        </h2>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/wallpapers"
              className="px-6 py-3 bg-[#577C8E] text-white rounded-md hover:bg-[#4a6b7b] transition-colors"
            >
              Спробувати ще раз
            </Link>
          </div>
        ) : products.length === 0 ? (
          <ProductGridSkeleton count={12} />
        ) : (
          <ProductLoader
            initialProducts={products}
            initialHasNextPage={hasNextPage}
            initialEndCursor={endCursor}
          />
        )}
      </div>
    </div>
  );
}
