import Banner from "@/components/Banner";
import CategoryPreview from "@/components/CategoryPreview";
import Benefit from "@/components/Benefit";
import FileIcon from "@/components/Media/benefit_icons/FileIcon";
import DeliveryIcon from "@/components/Media/benefit_icons/DeliveryIcon";
import HandsIcon from "@/components/Media/benefit_icons/HandsIcon";
import PaymentIcon from "@/components/Media/benefit_icons/PaymentIcon";
import ProductPreview from "@/components/ProductPreview";
import { sdk } from "@/lib/api";
import {
  BannerSkeleton,
  CategorySkeleton,
  ProductGridSkeleton,
} from "@/components/ProductSkeleton";
import { HomepageBannerQuery } from "../../types/graphql-types";
import Link from "next/link";

type BannerData = NonNullable<NonNullable<HomepageBannerQuery["page"]>["banner"]> | null;

type Category = {
  databaseId: number;
  name?: string | null;
  slug?: string | null;
  image?: {
    sourceUrl?: string | null;
  } | null;
};

type Product = {
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

async function getHomePageData(): Promise<{
  categories: Category[];
  featuredProducts: Product[];
  bannerData: BannerData;
  error: string | null;
}> {
  try {
    const [categoriesResult, productsResult, bannerResult] = await Promise.all([
      sdk.TopLevelCategoriesWithImages().catch(() => ({ productCategories: null })),
      sdk.FeaturedProducts({ count: 8 }).catch(() => ({ products: null })),
      sdk.HomepageBanner().catch(() => ({ page: null })),
    ]);

    return {
      categories: (categoriesResult.productCategories?.nodes as Category[]) || [],
      featuredProducts: (productsResult.products?.nodes as Product[]) || [],
      bannerData: bannerResult.page?.banner ?? null,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      categories: [],
      featuredProducts: [],
      bannerData: null,
      error: "Не вдалося завантажити дані. Спробуйте оновити сторінку.",
    };
  }
}

export default async function Home() {
  const { categories, featuredProducts, bannerData, error } =
    await getHomePageData();

  if (error && categories.length === 0 && featuredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Щось пішло не так
        </h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#577C8E] text-white rounded-md hover:bg-[#4a6b7b] transition-colors"
        >
          Оновити сторінку
        </Link>
      </div>
    );
  }

  return (
    <div>
      {bannerData ? (
        <Banner banner={bannerData} />
      ) : (
        <BannerSkeleton />
      )}
      <div className="flex flex-col px-[clamp(0.5rem,2vw,2rem)] gap-y-20 xl:gap-y-30 py-14 lg:py-20">
        <div className="flex flex-col gap-y-8 gap-x-10 md:flex-row">
          {categories.length > 0
            ? categories.map((category) => (
                <CategoryPreview
                  key={category.databaseId}
                  title={category.name || "Категорія недоступна"}
                  link={`/${category.slug}`}
                  imageUrl={
                    category.image?.sourceUrl || "/placeholder-category.jpg"
                  }
                />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-navy font-semibold text-3xl md:text-4xl mb-13">
            Чому обирають нас
          </h2>
          <div className="gap-x-8 gap-y-12 grid grid-cols-1 md:grid-cols-2 max-xl:justify-between xl:flex xl:flex-row">
            <Benefit
              title="Власне виробництво"
              description="Виготовляємо продукцію самостійно, контролюючи якість на кожному етапі."
              icon={<FileIcon />}
            />
            <Benefit
              title="Швидка доставка"
              description="Оперативна та надійна доставка, щоб ви отримали замовлення вчасно."
              icon={<DeliveryIcon />}
            />
            <Benefit
              title="Індивідуальний підхід"
              description="Персональні рішення, що відповідають вашим потребам і побажанням."
              icon={<HandsIcon />}
            />
            <Benefit
              title="Онлайн оплата"
              description="Зручні та безпечні способи оплати безпосередньо на сайті."
              icon={<PaymentIcon />}
            />
          </div>
        </div>
        <div>
          <div className="text-center">
            <h2 className="text-navy font-semibold max-md:text-3xl text-4xl mb-5">
              Популярні товари
            </h2>
            <h3 className="text-black max-md:hidden font-normal text-xl">
              Вибране для вас — бестселери, новинки та хіти продажів
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 my-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductPreview
                  key={product.databaseId}
                  imageUrl={product.image?.sourceUrl || "/placeholder.jpg"}
                  sku={product.sku || "N/A"}
                  title={product.name || "Назва відсутня"}
                  price={product.salePrice ?? product.regularPrice ?? "N/A"}
                  oldPrice={
                    product.regularPrice !== product.salePrice
                      ? product.regularPrice ?? undefined
                      : undefined
                  }
                  slug={product.slug || ""}
                />
              ))
            ) : (
              <ProductGridSkeleton count={8} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
