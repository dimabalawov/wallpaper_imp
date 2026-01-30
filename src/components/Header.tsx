"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchIcon from "./Media/Search";
import CartIcon from "./Media/Cart";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useCart } from "@/context/CartContext";

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
    navLinks[0].label,
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { itemCount } = useCart();

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSearchOpen && !target.closest(".search-container")) {
        handleSearchClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

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
              <Image
                src="/logo.png"
                alt="Faktura Print Studio"
                width={150}
                height={67}
              />
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
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`cursor-pointer hover:opacity-70 transition-opacity duration-300 ${
                isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Пошук"
            >
              <SearchIcon {...iconProps} />
            </button>
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

        {/* Search Overlay */}
        <div
          className={`search-container absolute right-16 sm:right-20 lg:right-28 xl:right-44 top-1/2 -translate-y-1/2 w-1/4 min-w-[280px] origin-right transition-all duration-300 ease-out ${
            isSearchOpen
              ? "opacity-100 scale-x-100 pointer-events-auto"
              : "opacity-0 scale-x-0 pointer-events-none"
          }`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук товарів..."
                className="w-full px-4 py-2 pl-10 text-base border-2 border-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white shadow-lg"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleSearchClose();
                  }
                }}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal text-white font-bold rounded-lg hover:bg-teal/90 transition-colors"
            >
              Знайти
            </button>
          </form>
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
                          openCategory === cat.label ? null : cat.label,
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
