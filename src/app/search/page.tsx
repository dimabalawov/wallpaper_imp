import { sdk } from "@/lib/api";
import ProductPreview from "@/components/ProductPreview";
import Link from "next/link";

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

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function searchProducts(query: string): Promise<{
  products: ProductNode[];
  error: string | null;
}> {
  if (!query || query.length < 2) {
    return { products: [], error: null };
  }

  try {
    const data = await sdk.SearchProducts({ search: query, first: 24 });
    return {
      products: (data.products?.nodes as ProductNode[]) || [],
      error: null,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      products: [],
      error: "Помилка пошуку. Спробуйте ще раз.",
    };
  }
}

function formatPrice(price: string | null | undefined): string {
  if (!price) return "";
  const num = parseFloat(price);
  return `${num.toFixed(0)} грн/м²`;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const { products, error } = await searchProducts(query);

  return (
    <div className="px-4 sm:px-8 md:px-[clamp(2rem,6vw,8rem)] lg:px-[clamp(3rem,10vw,12rem)] py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
          Результати пошуку
        </h1>
        {query && (
          <p className="text-gray-600">
            За запитом «<span className="font-medium text-navy">{query}</span>»{" "}
            {products.length > 0 ? (
              <>знайдено {products.length} товар{products.length === 1 ? "" : products.length < 5 ? "и" : "ів"}</>
            ) : (
              "нічого не знайдено"
            )}
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/wallpapers"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
          >
            Перейти до каталогу
          </Link>
        </div>
      )}

      {/* No Query State */}
      {!query && !error && (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-navy mb-2">
            Введіть пошуковий запит
          </h2>
          <p className="text-gray-500 mb-6">
            Використовуйте поле пошуку в шапці сайту
          </p>
          <Link
            href="/wallpapers"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
          >
            Переглянути каталог
          </Link>
        </div>
      )}

      {/* No Results State */}
      {query && !error && products.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-navy mb-2">
            Нічого не знайдено
          </h2>
          <p className="text-gray-500 mb-6">
            Спробуйте змінити пошуковий запит або перегляньте наш каталог
          </p>
          <Link
            href="/wallpapers"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
          >
            Переглянути каталог
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductPreview
              key={product.databaseId}
              title={product.name || "Без назви"}
              price={formatPrice(product.regularPrice)}
              oldPrice={product.salePrice ? formatPrice(product.salePrice) : undefined}
              sku={product.sku || ""}
              slug={`/wallpapers/${product.slug}`}
              imageUrl={product.image?.sourceUrl || "/placeholder.jpg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
