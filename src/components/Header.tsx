"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "./Media/Search";
import CartIcon from "./Media/Cart";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useCart } from "@/context/CartContext"; // 1. Імпортуємо хук кошика

const iconProps = { width: 24, height: 24, fill: "#2F4156" };

// Повертаємо статичний масив посилань, як у вас було спочатку
const navLinks = [
  {
    label: "ФОТОШПАЛЕРИ",
    href: "/wallpapers",
    subcategories: [
      { label: "Фотошпалери в дитячу", href: "/wallpapers/dityacha" },
      { label: "Фотошпалери до вітальні", href: "/wallpapers/vitalnya" },
      { label: "Фотошпалери на кухню", href: "/wallpapers/kuhnya" },
    ],
  },
  { label: "Сувеніри", href: "/souvenirs", subcategories: [] },
  { label: "Поліграфія", href: "/polygraphy", subcategories: [] },
];

export default function Header() {
  const [openCategory, setOpenCategory] = React.useState<string | null>(
    navLinks[0].label
  );

  // 2. Отримуємо кількість товарів з кошика
  const { itemCount } = useCart();

  return (
    <Disclosure
      as="nav"
      className="bg-white text-black w-full shadow-md sticky top-0 z-50"
    >
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-32">
        <div className="flex h-20 items-center justify-between relative">
          {/* Burger and Logo (Left) */}
          <div className="flex items-center gap-6">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy">
              <span className="sr-only">Відкрити меню</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2F4156"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </DisclosureButton>
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/logo.png" alt="Faktura Print Studio" width={100} height={44} />
            </Link>
          </div>

          {/* Desktop Links (Center) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex gap-6 uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-navy transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Icons (Right) */}
          <div className="flex items-center gap-6">
            <SearchIcon {...iconProps} />
            {/* 3. Оновлена іконка кошика з лічильником */}
            <Link href="/cart" className="relative cursor-pointer group">
              <CartIcon
                {...iconProps}
                className="group-hover:fill-teal transition-colors"
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-teal rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="lg:hidden fixed inset-0 z-50 flex">
        <div className="relative w-4/5 max-w-xs bg-white h-full shadow-xl flex flex-col animate-slide-in-left overflow-y-auto">
          <DisclosureButton
            className="absolute top-6 left-6 text-black p-2"
            as="button"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#2F4156"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DisclosureButton>
          <div className="flex flex-col gap-0 pt-20">
            {navLinks.map((cat) => (
              <div key={cat.label}>
                <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 text-left text-lg font-semibold text-black uppercase">
                  <Link
                    href={cat.href}
                    className="flex-1 text-left block hover:text-navy"
                  >
                    {cat.label}
                  </Link>
                  {cat.subcategories.length > 0 && (
                    <button
                      className="ml-2 p-2 -m-2 flex items-center justify-center"
                      onClick={() =>
                        setOpenCategory(
                          openCategory === cat.label ? null : cat.label
                        )
                      }
                      aria-label="Розгорнути підкатегорії"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          openCategory === cat.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="#2F4156"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {cat.subcategories.length > 0 && openCategory === cat.label && (
                  <div className="pl-8 pb-2 bg-gray-50">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block py-2 text-black text-base border-b border-gray-200 last:border-b-0 hover:text-teal"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <DisclosureButton as="div" className="flex-1 bg-black/30" />
      </DisclosurePanel>
    </Disclosure>
  );
}
