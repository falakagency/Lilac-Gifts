import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./data";

export type CartItem = {
  id: string;
  product: Product;
  qty: number;
  customization?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, qty?: number, customization?: string) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => void;
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

function makeItemId(productId: number, customization?: string): string {
  const c = (customization ?? "").trim();
  if (!c) return `p${productId}`;
  let encoded = c;
  try {
    encoded =
      typeof btoa !== "undefined"
        ? btoa(unescape(encodeURIComponent(c)))
        : c;
  } catch {
    encoded = c;
  }
  return `p${productId}-c${encoded}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (item): item is Partial<CartItem> & { product?: Product; qty?: number } =>
            !!item &&
            typeof item === "object" &&
            "product" in (item as Record<string, unknown>) &&
            !!(item as { product?: Product }).product &&
            typeof (item as { product: Product }).product.id === "number" &&
            typeof (item as { qty?: number }).qty === "number",
        )
        .map((item) => {
          const product = item.product as Product;
          const qty = item.qty as number;
          const customization =
            typeof item.customization === "string" && item.customization.trim()
              ? item.customization.trim()
              : undefined;
          const id = item.id ?? makeItemId(product.id, customization);
          return { id, product, qty, customization };
        });
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

  const addItem = (product: Product, qty: number = 1, customization?: string) => {
    const customTrim = customization?.trim() || undefined;
    const id = makeItemId(product.id, customTrim);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id, product, qty, customization: customTrim }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, qty } : i)));
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
