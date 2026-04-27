import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  totalCount: number;
  totalPriceText: string;
  totalPriceNumber: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "lilac-cart-v1";

function parsePrice(price: string): number {
  const m = price.match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item): item is CartItem =>
          !!item &&
          typeof item === "object" &&
          "product" in item &&
          !!(item as CartItem).product &&
          typeof (item as CartItem).product.id === "number" &&
          typeof (item as CartItem).qty === "number",
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
    );
  };

  const clear = () => setItems([]);

  const value = useMemo<CartContextType>(() => {
    const totalCount = items.reduce((s, i) => s + i.qty, 0);
    const totalPriceNumber = items.reduce(
      (s, i) => s + parsePrice(i.product.price) * i.qty,
      0,
    );
    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalCount,
      totalPriceNumber,
      totalPriceText: `${totalPriceNumber.toFixed(2)} د.أ`,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
