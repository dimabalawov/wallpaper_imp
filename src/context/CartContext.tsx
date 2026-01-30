// src/context/CartContext.tsx

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { toast } from "react-toastify";

// Cart item type
export type CartItem = {
  id: string;
  productId: string;
  productDatabaseId?: number;
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

// Action types for useReducer
type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

// Cart state type
type CartState = {
  items: CartItem[];
  isLoaded: boolean;
};

// Context type
type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
  isLoaded: boolean;
};

const STORAGE_KEY = "shoppingCart";

// Safe localStorage operations
function safeGetFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Validate that parsed data is an array of cart items
    if (!Array.isArray(parsed)) {
      console.warn("Invalid cart data in localStorage, resetting");
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    // Filter out invalid items
    return parsed.filter((item): item is CartItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number"
      );
    });
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore removal errors
    }
    return [];
  }
}

function safeSaveToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
      toast.error("Не вдалося зберегти кошик: пам'ять переповнена");
    } else {
      console.error("Error saving cart to localStorage:", error);
    }
  }
}

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload, isLoaded: true };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoaded: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const items = safeGetFromStorage();
    dispatch({ type: "SET_ITEMS", payload: items });
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (state.isLoaded) {
      safeSaveToStorage(state.items);
    }
  }, [state.items, state.isLoaded]);

  // Sync across tabs
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === STORAGE_KEY && event.newValue !== null) {
        try {
          const newItems = JSON.parse(event.newValue);
          if (Array.isArray(newItems)) {
            dispatch({ type: "SET_ITEMS", payload: newItems });
          }
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    // Validate dimensions
    if (item.width < 1 || item.width > 999 || item.height < 1 || item.height > 999) {
      toast.error("Невірні розміри. Ширина та висота мають бути від 1 до 999 см.");
      return;
    }

    // Validate price
    if (item.price <= 0 || !isFinite(item.price)) {
      toast.error("Помилка розрахунку ціни. Спробуйте ще раз.");
      return;
    }

    const newItem: CartItem = { ...item, id: crypto.randomUUID() };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    toast.success(`${item.name} додано до кошика!`);
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalPrice = useMemo(() => {
    return state.items.reduce((total, item) => total + item.price, 0);
  }, [state.items]);

  const itemCount = state.items.length;

  const value = useMemo(
    () => ({
      cartItems: state.items,
      addItem,
      removeItem,
      clearCart,
      totalPrice,
      itemCount,
      isLoaded: state.isLoaded,
    }),
    [state.items, state.isLoaded, addItem, removeItem, clearCart, totalPrice, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart має використовуватися в межах CartProvider");
  }
  return context;
}
