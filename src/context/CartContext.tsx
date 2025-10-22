// src/context/CartContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { toast } from "react-toastify";

// Тип товару в кошику (залишається як є)
export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  width: number;
  height: number;
  material: string;
  premium: boolean;
  laminate: boolean;
  glue: boolean;
  imageUrl?: string;
};

// 1. Оновлюємо тип, щоб він включав totalPrice
type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  totalPrice: number; // <--- ДОДАНО
  itemCount: number; // <--- ДОДАНО
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = { ...item, id: crypto.randomUUID() };
    setCartItems((prevItems) => [...prevItems, newItem]);
    toast.success(`${item.name} додано до кошика!`);
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 2. ДОДАНО: Автоматичний підрахунок загальної вартості
  // useMemo гарантує, що сума перераховується тільки при зміні cartItems
  const totalPrice = useMemo(() => {
    // reduce((total, item) => total + item.price, 0)
    // 0 - це початкове значення.
    // Це гарантує, що totalPrice__завжди_ буде числом (0, якщо кошик порожній),
    // а не undefined.
    return cartItems.reduce((total, item) => total + item.price, 0);
  }, [cartItems]);

  // 3. ДОДАНО: Кількість товарів
  const itemCount = cartItems.length;

  // 4. Оновлюємо об'єкт value, щоб він передавав нові значення
  const value = {
    cartItems,
    addItem,
    removeItem,
    totalPrice, // <--- ДОДАНО
    itemCount, // <--- ДОДАНО
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Хук useCart залишається без змін
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart має використовуватися в межах CartProvider");
  }
  return context;
}
