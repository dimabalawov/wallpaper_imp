"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
      <div className="max-w-2xl text-center">
        {/* Success icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
          Дякуємо за замовлення!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом
          для підтвердження деталей.
        </p>

        {/* Additional info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-navy mb-3">Що далі?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-teal mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                На вашу електронну пошту надіслано підтвердження замовлення
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-teal mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Наш менеджер зв'яжеться з вами протягом робочого дня</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-teal mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Термін виготовлення та відправки: 1-3 робочі дні</span>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/wallpapers"
            className="bg-teal text-white font-bold rounded-lg px-8 py-3 text-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors"
          >
            Продовжити покупки
          </Link>
          <Link
            href="/"
            className="bg-transparent text-teal font-bold rounded-lg px-8 py-3 text-lg hover:bg-teal hover:text-white border-2 border-teal transition-colors"
          >
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
