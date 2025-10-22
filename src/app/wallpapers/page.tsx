import CategorySidebar from "@/components/CategorySidebar";
import ProductLoader from "@/components/ProductLoader";
import { sdk } from "@/lib/api";

const ITEMS_PER_PAGE = 1; // Количество товаров на одну загрузку

export default async function WallpapersPage() {
  // Загружаем самую первую страницу
  const initialData = await sdk.ProductsPaginated({
    first: ITEMS_PER_PAGE,
    after: null, // `null` для первого запроса
  });

  const initialProducts = initialData.products?.nodes || [];
  const initialPageInfo = initialData.products?.pageInfo;

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

        {/* Передаем начальные данные в клиентский компонент,
          который будет управлять дальнейшей загрузкой.
        */}
        <ProductLoader
          initialProducts={initialProducts}
          initialHasNextPage={initialPageInfo?.hasNextPage || false}
          initialEndCursor={initialPageInfo?.endCursor || null}
        />
      </div>
    </div>
  );
}
