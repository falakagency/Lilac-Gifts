export type Product = {
  id: number;
  name: string;
  price: string;
  desc: string;
  img: string;
  bestseller?: boolean;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: 1,
    name: "التخرج",
    icon: "🎓",
    products: [
      { id: 101, name: "طقم تخرج أمن عام", price: "15 د.أ", desc: "طقم هدايا مخصص لمناسبة التخرج", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=تخرج", bestseller: true },
      { id: 102, name: "طقم تخرج جامعي", price: "20 د.أ", desc: "هدية أنيقة للخريجين الجدد", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=جامعة", bestseller: true },
    ],
  },
  {
    id: 2,
    name: "ترفيعات عسكرية",
    icon: "⭐",
    products: [
      { id: 201, name: "طقم ترفيع ضابط", price: "25 د.أ", desc: "تهانٍ بالرتبة الجديدة", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=ترفيع" },
    ],
  },
  {
    id: 3,
    name: "يوم الأم",
    icon: "🌸",
    products: [
      { id: 301, name: "طقم يوم الأم الكلاسيكي", price: "18 د.أ", desc: "أجمل هدية لأحن الأمهات", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=الأم", bestseller: true },
    ],
  },
  {
    id: 4,
    name: "رمضان وعيد الفطر",
    icon: "🌙",
    products: [
      { id: 401, name: "طقم رمضان الفاخر", price: "22 د.أ", desc: "إضاءة بيتك بنكهة رمضان", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=رمضان" },
    ],
  },
  {
    id: 5,
    name: "دلات وفناجين",
    icon: "☕",
    products: [
      { id: 501, name: "دلة بطباعة مخصصة", price: "30 د.أ", desc: "اطبع اسمك أو صورتك", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=دلة", bestseller: true },
    ],
  },
];

export const allProducts: Product[] = categories.flatMap((c) => c.products);

export const bestsellerProducts: Product[] = allProducts.filter((p) => p.bestseller);

export function findProduct(id: number): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function findCategory(id: number): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function findCategoryByProduct(productId: number): Category | undefined {
  return categories.find((c) => c.products.some((p) => p.id === productId));
}

export function parsePriceNumber(price: string): number {
  const m = price.match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

export type BudgetFilterValue = "all" | "lt20" | "20to40" | "gt40";

export const BUDGET_OPTIONS: { value: BudgetFilterValue; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "lt20", label: "أقل من 20 د.أ" },
  { value: "20to40", label: "20 - 40 د.أ" },
  { value: "gt40", label: "أكثر من 40 د.أ" },
];

export function filterByBudget(products: Product[], budget: BudgetFilterValue): Product[] {
  if (budget === "all") return products;
  return products.filter((p) => {
    const n = parsePriceNumber(p.price);
    if (budget === "lt20") return n < 20;
    if (budget === "20to40") return n >= 20 && n <= 40;
    if (budget === "gt40") return n > 40;
    return true;
  });
}

export const WHATSAPP_PHONE = "962781747824";
