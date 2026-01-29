import React from "react";
// 1. Припускаємо, що тип запиту імпортовано правильно
import { HomepageBannerQuery } from "../../types/graphql-types";
import Link from "next/link"; // Додано імпорт Link
import Image from "next/image"; // Імпортуємо Image з next/image

// 2. Визначаємо правильний тип для пропса banner
//    Використовуємо NonNullable, щоб переконатися, що page та banner існують
//    Зверніть увагу: шлях тепер ["banner"], як у вашому оновленому коді
type BannerFields = NonNullable<
  NonNullable<HomepageBannerQuery["page"]>["banner"]
>;

interface BannerProps {
  // 3. Використовуємо пропс banner з правильним типом
  banner: BannerFields | null | undefined;
}

// 4. Оновлюємо сигнатуру компонента
const Banner: React.FC<BannerProps> = ({ banner }) => {
  // Використовуємо значення за замовчуванням, якщо banner null або undefined
  const title =
    banner?.bannerTitle || "Створи свій простір з нашими фотообоями!";
  const subtitle = banner?.bannerSubtitle;
  const buttonText = banner?.bannerButtonText || "ОБРАТИ ДИЗАЙН";
  const buttonLink = banner?.bannerButtonLink || "/wallpapers"; // Посилання за замовчуванням

  // 5. ✅ ВИПРАВЛЕНО: Правильно отримуємо URL зображення
  //    ACF повертає об'єкт, навіть якщо налаштовано "Image URL".
  //    Нам потрібна властивість sourceUrl всередині.
  //    Припускаємо, що структура може бути bannerImage.node.sourceUrl або просто bannerImage.sourceUrl
  const imageUrl = banner?.bannerImage?.node?.sourceUrl;

  return (
    <section
      className="w-full flex flex-col items-center justify-center bg-gray-200 px-4 md:px-16 relative min-h-[350px] md:min-h-[500px] overflow-hidden" // Додано overflow-hidden
    >
      {/* Використовуємо next/image для фону */}
      {imageUrl ? (
        <Image
          src={imageUrl} // Передаємо виправлений URL
          alt={title || "Фонове зображення банера"} // Додано alt текст за замовчуванням
          fill
          sizes="100vw"
          className="object-cover object-center absolute inset-0 z-0"
          priority={true} // Головне зображення, завантажуємо пріоритетно
        />
      ) : (
        // Залишаємо сірий фон, якщо картинки немає
        <div className="absolute inset-0 bg-gray-200 z-0"></div>
      )}

      {/* Оверлей для кращої читабельності тексту */}
      <div className="flex flex-col gap-y-10 max-w-6xl text-center z-10 items-center">
        {" "}
        {/* Додано text-white та padding */}
        <h1 className="text-5xl max-md:text-3xl font-bold text-navy">
          {" "}
          {/* Змінено розмір та додано тінь */}
          {title}
        </h1>
        {subtitle && (
          <h2 className="max-w-lg text-2xl  text-black hidden md:block">
            {subtitle}
          </h2>
        )}
        {/* Кнопка тепер є Link */}
        <Link
          href={buttonLink}
          className="border-2 uppercase border-teal text-teal px-7 py-5 rounded-lg text-lg font-semibold hover:bg-teal hover:text-white transition-colors" // Змінено padding та кольори
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default Banner;
