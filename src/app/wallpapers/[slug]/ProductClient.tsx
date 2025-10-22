"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import DimensionInput from "@/components/DimensionInput";
import Carousel from "@/components/Carousel";
import ProductPreview from "@/components/ProductPreview";
import ArrowHorizontalIcon from "@/components/Media/ArrowHorizontalIcon";
import ArrowVerticalIcon from "@/components/Media/ArrowVerticalIcon";
import Extra from "@/components/Extra";
import Material from "@/components/Material";

import {
  ProductBySlugQuery,
  // Нам потрібні ці типи для type guard
  GlobalProductAttribute,
  PaMaterial,
  PaExtraFeatures,
} from "../../../../types/graphql-types";
import { useCart, CartItem } from "@/context/CartContext";

// --- Типізація для розпакованих даних ---
type CleanMaterial = {
  databaseId: number;
  slug: string;
  name: string;
  description: string;
  priceModifier: number;
  imageUrl?: string;
};
type CleanExtraFeature = {
  databaseId: number;
  slug: string;
  name: string;
  description: string;
  priceType: "fixed" | "sqm";
  priceValue: number;
};
// ------------------------------------

export default function ProductClient({
  product,
}: {
  product: NonNullable<ProductBySlugQuery["product"]>;
}) {
  // --- 1. РОЗПАКОВКА ДАНИХ з GraphQL ---

  // --- Прості поля ---
  const regularPriceSqm = parseFloat(product?.regularPrice || "0");
  const salePriceSqm = parseFloat(product?.salePrice || "0");
  const hasSale = salePriceSqm > 0 && salePriceSqm < regularPriceSqm;
  const basePriceForCalc = hasSale ? salePriceSqm : regularPriceSqm;

  // --- Атрибути (Матеріали та Послуги) ---
  const allAttributes = product.attributes?.nodes || [];

  // --- ✅ ОСЬ ВИПРАВЛЕННЯ ---
  // 1. Спочатку фільтруємо масив, щоб залишити ТІЛЬКИ глобальні атрибути.
  //    (attr is GlobalProductAttribute) - це "type guard", який змінює тип масиву.
  const globalAttributes = allAttributes
    .filter((attr) => attr.__typename === "GlobalProductAttribute")
    .map((attr) => attr as GlobalProductAttribute);
  // -------------------------

  // --- Матеріали ---
  // 2. Тепер безпечно шукаємо `pa_material` у відфільтрованому масиві
  const materialsNode = globalAttributes.find(
    (attr) => attr.slug === "pa_material"
  );

  const materials: CleanMaterial[] = useMemo(
    () =>
      (materialsNode?.terms?.nodes || [])
        .filter(
          (term): term is PaMaterial =>
            (term as PaMaterial).__typename === "PaMaterial"
        )
        .map((term) => ({
          databaseId: term.databaseId,
          slug: term.slug || "unknown",
          name: term.name || "Material",
          description: term.description || "",
          priceModifier: term.materialsExtra?.price_modifier || 0,
          imageUrl:
            term.materialsExtra?.material_image?.node.sourceUrl || undefined,
        })),
    [materialsNode]
  );

  // --- Дод. послуги ---
  // 4. Повторюємо те ж саме для дод. послуг
  const extraFeaturesNode = globalAttributes.find(
    (attr) => attr.slug === "pa_extra_features"
  );

  const extraFeatures: CleanExtraFeature[] = useMemo(
    () =>
      (extraFeaturesNode?.terms?.nodes || [])
        .filter(
          (term): term is PaExtraFeatures =>
            (term as PaExtraFeatures).__typename === "PaExtraFeatures"
        )
        .map((term) => ({
          databaseId: term.databaseId,
          slug: term.slug || "unknown",
          name: term.name || "Extra Feature",
          description: term.description || "",
          priceType:
            term.extraServiceFields?.price_type === "sqm" ? "sqm" : "fixed",
          priceValue: term.extraServiceFields?.price || 0,
        })),
    [extraFeaturesNode]
  );

  // --- Характеристики ---
  const characteristics =
    product.__typename === "SimpleProduct" ? product.characteristics : null;

  // --- Стан (State) ---
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(100);
  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState<
    string | null
  >(materials[0]?.slug || null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const { addItem } = useCart();

  // --- (Весь ваш код для розрахунку ціни залишається тут) ---
  // ...
  const selectedMaterial = materials.find(
    (m) => m.slug === selectedMaterialSlug
  );
  const materialPriceModifier = selectedMaterial?.priceModifier || 0;
  const currentMaterialPricePerSqm = basePriceForCalc + materialPriceModifier;
  const oldMaterialPricePerSqm = hasSale
    ? regularPriceSqm + materialPriceModifier
    : 0;
  const areaInSqm = (width / 100) * (height / 100);
  let pricePerSqmExtras = 0;
  let flatExtrasPrice = 0;
  selectedExtras.forEach((extraSlug) => {
    const feature = extraFeatures.find((f) => f.slug === extraSlug);
    if (!feature) return;
    if (feature.priceType === "sqm") {
      pricePerSqmExtras += feature.priceValue;
    } else {
      flatExtrasPrice += feature.priceValue;
    }
  });
  const finalPrice =
    (currentMaterialPricePerSqm + pricePerSqmExtras) * areaInSqm +
    flatExtrasPrice;
  const finalOldPrice = hasSale
    ? (oldMaterialPricePerSqm + pricePerSqmExtras) * areaInSqm + flatExtrasPrice
    : 0;
  // --- (Кінець коду розрахунку ціни) ---

  // --- (Ваш handleAddToCart залишається тут) ---
  const handleAddToCart = () => {
    if (!selectedMaterial) {
      alert("Будь ласка, оберіть матеріал.");
      return;
    }
    const newItem: Omit<CartItem, "id"> = {
      productId: product?.sku || "unknown",
      name: product?.name || "Без назви",
      imageUrl: product?.image?.sourceUrl || "/placeholder.jpg",
      price: finalPrice,
      width: width,
      height: height,
      material: selectedMaterial.name, // Використовуємо .name
      premium: selectedExtras.includes("premium_print"),
      laminate: selectedExtras.includes("laminuvannya"),
      glue: selectedExtras.includes("glue"),
    };
    addItem(newItem);
  };
  function handleExtraChange(slug: string, isChecked: boolean): void {
    setSelectedExtras((prev) =>
      isChecked ? [...prev, slug] : prev.filter((s) => s !== slug)
    );
  }
  // ------------------------------------

  // --- JSX ---
  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-[clamp(2rem,6vw,8rem)] py-8">
      <div className="flex flex-col md:flex-row justify-between gap-x-8 lg:gap-x-16 mb-12">
        {/* Left: Images & Description */}
        <div className="md:w-1/2 flex flex-col">
          <div className="w-full aspect-square bg-[#D9D9D9] rounded-2xl mb-6 overflow-hidden">
            <Image
              src={product?.image?.sourceUrl || "/placeholder.jpg"}
              width={600}
              height={600}
              alt={product?.name || "Product Image"}
              className="object-cover w-full h-full rounded-2xl"
              priority={true}
            />
          </div>
          <div className="flex gap-3 w-full justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-[#D9D9D9] aspect-square rounded-xl"
              />
            ))}
          </div>
          {/* Опис та Характеристики для Десктопу */}
          <div className="mb-4 max-md:hidden">
            <div className="font-semibold text-2xl text-navy mb-2">Опис:</div>
            <div
              className="mb-4 text-[#2F4157] text-base"
              dangerouslySetInnerHTML={
                product?.description
                  ? { __html: product.description }
                  : { __html: "<p>Опис товару відсутній.</p>" }
              }
            />
            <div className="font-semibold text-2xl text-navy mb-2 mt-6">
              Характеристики:
            </div>
            <ul className="list-none pl-1 text-[#2F4157] text-base">
              <li>– Щільність: {characteristics?.density || 200} г/м²</li>
              <li>
                – Стійкість до вологи:{" "}
                {characteristics?.waterproof ? "Так" : "Ні"}
              </li>
              <li>
                – Рекомендована кімната:{" "}
                {characteristics?.recommended_rooms?.join(", ") ||
                  "дитяча, спальня"}
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Info & Form */}
        <div className="flex-1 flex flex-col max-w">
          <h1 className="text-2xl md:text-3xl text-black font-bold leading-tight mb-2">
            {product?.name}
          </h1>
          <div className="text-teal text-lg font-medium mb-4">
            {product?.sku}{" "}
          </div>

          {/* Блок Ціни за м² */}
          <div className="mb-6">
            {hasSale && (
              <div className="text-xl md:text-2xl font-bold text-teal line-through">
                {oldMaterialPricePerSqm.toFixed(2)}
                {" грн/м²"}
              </div>
            )}
            <div className="text-2xl md:text-3xl font-black text-navy">
              {currentMaterialPricePerSqm.toFixed(2)}
              {" грн/м²"}
            </div>
          </div>

          {/* Опис та Характеристики для Мобільних */}
          <div className="mb-4 md:hidden">
            <div className="font-semibold text-2xl text-navy mb-2">Опис:</div>
            <div
              className="mb-4 text-[#2F4157] text-base"
              dangerouslySetInnerHTML={
                product?.description
                  ? { __html: product.description }
                  : { __html: "<p>Опис товару відсутній.</p>" }
              }
            />
            <div className="font-semibold text-2xl text-navy mb-2 mt-6">
              Характеристики:
            </div>
            <ul className="list-none pl-1 text-[#2F4157] text-base">
              <li>– Щільність: {characteristics?.density || 200} г/м²</li>
              <li>
                – Стійкість до вологи:{" "}
                {characteristics?.waterproof ? "Так" : "Ні"}
              </li>
              <li>
                – Рекомендована кімната:{" "}
                {characteristics?.recommended_rooms?.join(", ") ||
                  "дитяча, спальня"}
              </li>
            </ul>
          </div>

          {/* Калькулятор */}
          <div className="border border-teal rounded-xl p-4 sm:p-6 pb-8 mb-6">
            <div className="mb-4">
              <div className="mb-4 text-navy font-medium text-2xl">
                Введіть розміри стіни
              </div>
              <div className="flex gap-4 mb-8">
                <DimensionInput
                  label="Ширина"
                  value={width}
                  onChange={setWidth}
                  min={1}
                  max={999}
                  unit="см"
                  icon={<ArrowHorizontalIcon />}
                />
                <DimensionInput
                  label="Висота"
                  value={height}
                  onChange={setHeight}
                  min={1}
                  max={999}
                  unit="см"
                  icon={<ArrowVerticalIcon />}
                />
              </div>
            </div>

            {/* Динамічний Вибір Матеріалу */}
            <div className="mb-4">
              <div className="font-medium text-2xl text-black mb-4">
                Оберіть матеріал
              </div>
              <div className="flex flex-col gap-4">
                {materials.map((m) => (
                  <Material
                    key={m.databaseId}
                    label={m.name}
                    desc={`${m.description} ${
                      m.priceModifier > 0 ? `(+${m.priceModifier} грн/м²)` : ""
                    }`}
                    checked={selectedMaterialSlug === m.slug}
                    onChange={() => setSelectedMaterialSlug(m.slug)}
                    imageUrl={m.imageUrl}
                  />
                ))}
              </div>
            </div>

            {/* Динамічні Додаткові послуги */}
            <div className="flex flex-col gap-6 border-t  border-teal pt-8 mt-8 mb-4 text-navy">
              {extraFeatures.map((f) => (
                <Extra
                  key={f.databaseId}
                  checked={selectedExtras.includes(f.slug)}
                  onChange={(isChecked) => handleExtraChange(f.slug, isChecked)}
                  heading={f.name}
                  price={
                    <span>
                      +{f.priceValue} грн {f.priceType === "sqm" ? "/м²" : ""}
                    </span>
                  }
                  desc={<span>{f.description}</span>}
                  inputClassName="accent-teal self-start mt-2 mr-3"
                  labelClassName="flex flex-row cursor-pointer"
                />
              ))}
            </div>

            {/* Фінальна ціна і кнопка */}
            <div className="flex justify-between mt-8 border-t border-teal pt-4 mb-4">
              <div className="text-xl sm:text-2xl self-baseline-last text-navy font-semibold">
                Вартість:
              </div>
              <div className="flex flex-col items-end">
                {hasSale && (
                  <div className="text-teal line-through mb-[-0.2rem] max-md:text-lg text-xl font-black">
                    {finalOldPrice.toFixed(2)} грн
                  </div>
                )}
                <div className="max-md:text-xl text-2xl font-extrabold text-navy whitespace-nowKrap">
                  {finalPrice.toFixed(2)} грн
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-teal text-white font-bold w-full rounded-lg px-8 py-3 text-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors"
            >
              ЗАМОВИТИ
            </button>
          </div>
        </div>
      </div>

      {/* Карусель "Схожі товари" */}
      <Carousel visibleCount={5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductPreview
            key={i}
            imageUrl="/placeholder.jpg"
            slug="kazkovyi-lis"
            title="Фотошпалери багато золотистих пір'їнок"
            price="450 грн/м²"
            oldPrice="550 грн/м²"
            sku="FOB-2045"
          />
        ))}
      </Carousel>
    </div>
  );
}
