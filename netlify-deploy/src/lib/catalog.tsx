import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase, type DbCategory, type DbProduct } from "./supabase";
import type { Category, Product } from "../data";

function formatPrice(n: number): string {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `${s} د.أ`;
}

function dbToProduct(row: DbProduct): Product {
  const gallery = Array.isArray(row.gallery) ? row.gallery.filter(Boolean) : [];
  return {
    id: row.id,
    name: row.name,
    price: formatPrice(Number(row.price ?? 0)),
    desc: row.description ?? "",
    img: row.image_url ?? "",
    gallery: gallery.length > 0 ? gallery : undefined,
    bestseller: row.bestseller ?? false,
    rating: Number(row.rating ?? 5),
    reviews: row.reviews ?? 0,
  };
}

type CatalogContextValue = {
  loading: boolean;
  error: string | null;
  categories: Category[];
  allProducts: Product[];
  bestsellerProducts: Product[];
  findProduct: (id: number) => Product | undefined;
  findCategory: (id: number) => Category | undefined;
  findCategoryByProduct: (productId: number) => Category | undefined;
  refetch: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("id", { ascending: true }),
        supabase.from("products").select("*").order("id", { ascending: true }),
      ]);

      if (catRes.error) throw new Error(catRes.error.message);
      if (prodRes.error) throw new Error(prodRes.error.message);

      const cats = (catRes.data ?? []) as DbCategory[];
      const prods = (prodRes.data ?? []) as DbProduct[];

      const byCat = new Map<number, Product[]>();
      for (const p of prods) {
        if (p.category_id == null) continue;
        const arr = byCat.get(p.category_id) ?? [];
        arr.push(dbToProduct(p));
        byCat.set(p.category_id, arr);
      }

      const result: Category[] = cats.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon ?? "🎁",
        products: byCat.get(c.id) ?? [],
      }));

      setCategories(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const allProducts = categories.flatMap((c) => c.products);
  const bestsellerProducts = allProducts.filter((p) => p.bestseller);

  const value: CatalogContextValue = {
    loading,
    error,
    categories,
    allProducts,
    bestsellerProducts,
    findProduct: (id) => allProducts.find((p) => p.id === id),
    findCategory: (id) => categories.find((c) => c.id === id),
    findCategoryByProduct: (productId) =>
      categories.find((c) => c.products.some((p) => p.id === productId)),
    refetch: load,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
