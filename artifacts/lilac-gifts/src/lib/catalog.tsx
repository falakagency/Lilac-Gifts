import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase, type DbCategory, type DbProduct } from "./supabase";
import {
  type Category,
  type Product,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  type SeedCategory,
  type SeedProduct,
} from "../data";

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

function seedToProduct(row: SeedProduct): Product {
  return {
    id: row.id,
    name: row.name,
    price: formatPrice(row.price),
    desc: row.description,
    img: row.image_url,
    gallery: row.gallery.length > 0 ? row.gallery : undefined,
    bestseller: row.bestseller,
    rating: row.rating,
    reviews: row.reviews,
  };
}

function buildCategories(
  cats: { id: number; name: string; icon: string | null }[],
  prods: Product[],
): Category[] {
  const byCat = new Map<number, Product[]>();
  for (const p of prods) {
    // need original category_id from db row; rebuilt outside
    void p;
  }
  void byCat;
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon ?? "🎁",
    products: [],
  }));
}
void buildCategories;

function categoriesFromSeed(): Category[] {
  const byCat = new Map<number, Product[]>();
  for (const sp of SEED_PRODUCTS) {
    const arr = byCat.get(sp.category_id) ?? [];
    arr.push(seedToProduct(sp));
    byCat.set(sp.category_id, arr);
  }
  return SEED_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    products: byCat.get(c.id) ?? [],
  }));
}

function categoriesFromDb(cats: DbCategory[], prods: DbProduct[]): Category[] {
  const byCat = new Map<number, Product[]>();
  for (const p of prods) {
    if (p.category_id == null) continue;
    const arr = byCat.get(p.category_id) ?? [];
    arr.push(dbToProduct(p));
    byCat.set(p.category_id, arr);
  }
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon ?? "🎁",
    products: byCat.get(c.id) ?? [],
  }));
}

async function seedSupabase(): Promise<void> {
  const catRows: SeedCategory[] = SEED_CATEGORIES;
  const prodRows = SEED_PRODUCTS;

  const catRes = await supabase.from("categories").upsert(catRows, { onConflict: "id" });
  if (catRes.error) {
    console.warn("[seed] categories upsert failed:", catRes.error.message);
  }
  const prodRes = await supabase.from("products").upsert(prodRows, { onConflict: "id" });
  if (prodRes.error) {
    console.warn("[seed] products upsert failed:", prodRes.error.message);
  }
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
  const [categories, setCategories] = useState<Category[]>(() => categoriesFromSeed());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("id", { ascending: true }),
        supabase.from("products").select("*").order("id", { ascending: true }),
      ]);

      const catErr = catRes.error?.message ?? null;
      const prodErr = prodRes.error?.message ?? null;

      const cats = (catRes.data ?? []) as DbCategory[];
      const prods = (prodRes.data ?? []) as DbProduct[];

      // If both tables are empty (and no error), auto-seed Supabase from local seed data
      if (!catErr && !prodErr && cats.length === 0 && prods.length === 0) {
        try {
          await seedSupabase();
          // Re-fetch after seeding
          const [catRes2, prodRes2] = await Promise.all([
            supabase.from("categories").select("*").order("id", { ascending: true }),
            supabase.from("products").select("*").order("id", { ascending: true }),
          ]);
          const cats2 = (catRes2.data ?? []) as DbCategory[];
          const prods2 = (prodRes2.data ?? []) as DbProduct[];
          if (cats2.length > 0 || prods2.length > 0) {
            setCategories(categoriesFromDb(cats2, prods2));
            return;
          }
        } catch (seedErr) {
          console.warn("[seed] failed:", seedErr);
        }
        // Seed failed → show local seed data anyway
        setCategories(categoriesFromSeed());
        return;
      }

      // If there was an error fetching → fallback to local seed
      if (catErr || prodErr) {
        setError(catErr ?? prodErr);
        setCategories(categoriesFromSeed());
        return;
      }

      // Normal path: use real data, but if Supabase has no products at all, still show local seed
      if (cats.length === 0 && prods.length === 0) {
        setCategories(categoriesFromSeed());
      } else {
        setCategories(categoriesFromDb(cats, prods));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCategories(categoriesFromSeed());
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
