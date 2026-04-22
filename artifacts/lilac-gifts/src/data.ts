export type Product = {
  id: number;
  name: string;
  price: string;
  desc: string;
  img: string;
  bestseller?: boolean;
  rating: number;
  reviews: number;
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
      { id: 101, name: "طقم تخرج أمن عام", price: "15 د.أ", desc: "طقم هدايا مخصص لمناسبة التخرج", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=تخرج", bestseller: true, rating: 4.8, reviews: 47 },
      { id: 102, name: "طقم تخرج جامعي", price: "20 د.أ", desc: "هدية أنيقة للخريجين الجدد", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=جامعة", bestseller: true, rating: 4.9, reviews: 63 },
    ],
  },
  {
    id: 2,
    name: "ترفيعات عسكرية",
    icon: "⭐",
    products: [
      { id: 201, name: "طقم ترفيع ضابط", price: "25 د.أ", desc: "تهانٍ بالرتبة الجديدة", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=ترفيع", rating: 4.7, reviews: 31 },
    ],
  },
  {
    id: 3,
    name: "يوم الأم",
    icon: "🌸",
    products: [
      { id: 301, name: "طقم يوم الأم الكلاسيكي", price: "18 د.أ", desc: "أجمل هدية لأحن الأمهات", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=الأم", bestseller: true, rating: 5.0, reviews: 89 },
    ],
  },
  {
    id: 4,
    name: "رمضان وعيد الفطر",
    icon: "🌙",
    products: [
      { id: 401, name: "طقم رمضان الفاخر", price: "22 د.أ", desc: "إضاءة بيتك بنكهة رمضان", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=رمضان", rating: 4.6, reviews: 24 },
    ],
  },
  {
    id: 5,
    name: "دلات وفناجين",
    icon: "☕",
    products: [
      { id: 501, name: "دلة بطباعة مخصصة", price: "30 د.أ", desc: "اطبع اسمك أو صورتك", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=دلة", bestseller: true, rating: 4.9, reviews: 56 },
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

export type Occasion = {
  name: string;
  emoji: string;
  month: number;
  day: number;
};

export const OCCASIONS: Occasion[] = [
  { name: "يوم الأم", emoji: "🌸", month: 3, day: 21 },
  { name: "يوم العلم الأردني", emoji: "🇯🇴", month: 4, day: 4 },
  { name: "عيد الفطر", emoji: "🌙", month: 3, day: 20 },
  { name: "التخرج", emoji: "🎓", month: 6, day: 1 },
  { name: "العودة للمدارس", emoji: "📚", month: 9, day: 1 },
];

export function getNextOccasion(now: Date = new Date()): { occasion: Occasion; date: Date; daysLeft: number } {
  const year = now.getFullYear();
  const today = new Date(year, now.getMonth(), now.getDate());
  let best: { occasion: Occasion; date: Date; daysLeft: number } | null = null;
  for (const o of OCCASIONS) {
    let d = new Date(year, o.month - 1, o.day);
    if (d < today) d = new Date(year + 1, o.month - 1, o.day);
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    if (!best || diff < best.daysLeft) best = { occasion: o, date: d, daysLeft: diff };
  }
  return best!;
}
