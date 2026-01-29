"use client";

import React from "react";
import CartItemNew from "@/components/CartItem"; // 👈 Ми імпортуємо ваш компонент
import Carousel from "@/components/Carousel";
import ProductPreview from "@/components/ProductPreview";
import ArrowIcon from "@/components/Media/ArrowIcon";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // 👈 Імпортуємо хук кошика

export default function CartPage() {
  // Отримуємо реальні дані з кошика
  const { cartItems, totalPrice, itemCount } = useCart();

  // Якщо кошик порожній, показуємо повідомлення
  if (itemCount === 0) {
    return (
      <div className="h-max text-center py-20 px-4">
        <h1 className="text-3xl font-semibold text-navy mb-4">
          Ваш кошик порожній
        </h1>
        <p className="text-gray-600 mb-8">
          Здається, ви ще нічого не додали. Давайте це виправимо!
        </p>
        <Link
          href="/wallpapers"
          className="bg-teal text-white font-bold rounded-lg px-8 py-3 text-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  // Якщо товари є, показуємо основну розмітку (ваш дизайн)
  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-[clamp(2rem,6vw,8rem)] lg:px-[clamp(3rem,10vw,16rem)] py-8">
      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-6">
        <div className="space-y-8 max-w-250 w-full border-2 border-teal rounded-lg p-6">
          <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-navy">
            Ваші товари ({itemCount})
          </h1>

          {/* 👇 ОСЬ КЛЮЧОВИЙ МОМЕНТ:
            Ми не пишемо HTML для товару тут. Ми просто кажемо:
            "Для кожного товару в кошику, будь ласка, відмалюй компонент CartItemNew"
          */}
          {cartItems.map((item) => (
            <CartItemNew key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-col">
          <div className="sm:min-w-100 w-full border-2 border-teal rounded-lg p-6 mb-4">
            <div className="flex flex-row gap-x-4 border-b-1 border-teal pb-6">
              <input
                type="text"
                placeholder="Промокод"
                className="w-full px-4 rounded-lg border-1 border-teal text-black outline-none bg-transparent text-lg font-normal"
              />
              <button className="bg-teal max-w-30 min-h-12 text-[14px] uppercase items-center text-white font-bold w-full rounded-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors">
                Застосувати
              </button>
            </div>
            <div className="flex flex-col text-navy">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-6 mb-4  text-xl">
                <div className="font-medium">Доставка:</div>
                <div>За тарифами перевізника</div>
              </div>
              <div className="flex flex-row justify-between items-center text-xl sm:text-2xl font-bold tracking-wide">
                <div>Разом до сплати:</div>
                {/* 👇 Ми беремо `totalPrice` прямо з `useCart()`,
                  де він вже гарантовано є числом.
                */}
                <div>{totalPrice.toFixed(2)} грн</div>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="bg-teal uppercase text-white font-bold w-full rounded-lg px-8 py-3 sm:text-xl hover:bg-transparent hover:text-teal border-2 border-teal transition-colors max-sm:mb-8 text-center block"
          >
            оформити замовлення
          </Link>
        </div>
      </div>
      <Link
        href="/wallpapers"
        className="text-teal max-lg:hidden flex flex-row gap-2 items-center underline text-xl font-medium mb-4"
      >
        <ArrowIcon />
        Повернутися до покупок
      </Link>
      <Carousel visibleCount={5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductPreview
            key={i}
            title="Фотошпалери багато золотистих пір'їнок"
            price="450 грн/м²"
            oldPrice="550 грн/м²"
            sku="FOB-2045"
            slug="/placeholder"
            imageUrl="/placeholder.jpg"
          />
        ))}
      </Carousel>
    </div>
  );
}
