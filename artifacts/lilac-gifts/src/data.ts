export type Product = {
  id: number;
  name: string;
  price: string;
  desc: string;
  img: string;
  gallery?: string[];
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

export const CONTACT_PHONE_LOCAL = "0782859651";
export const CONTACT_PHONE_INTL = "962782859651";
export const WHATSAPP_PHONE = "962782859651";
export const INSTAGRAM_URL = "https://www.instagram.com/lilac_gifts2022?igsh=MWNvOGJoMnh6NHVmZQ==";
export const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxvmQ1XQjs40gAQ-v-M9WiN1egNBHCJlRgqqM_fuUgw7bSDiT2g82Sq8g9LoSE1EYEs/exec";

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

export type SeedCategory = { id: number; name: string; icon: string };
export type SeedProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  gallery: string[];
  category_id: number;
  bestseller: boolean;
  rating: number;
  reviews: number;
};

export const SEED_CATEGORIES: SeedCategory[] = [
  { id: 1, name: "التخرج", icon: "🎓" },
  { id: 2, name: "ترفيعات عسكرية", icon: "⭐" },
  { id: 3, name: "يوم الأم", icon: "🌸" },
  { id: 4, name: "رمضان وعيد الفطر", icon: "🌙" },
  { id: 5, name: "دلات وفناجين", icon: "☕" },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: 101,
    name: "طقم تخرج أمن عام",
    price: 15,
    description: "طقم هدايا مخصص لمناسبة التخرج، مع طباعة اسم الخريج",
    image_url: "/products/amn-aam.jpeg",
    gallery: [],
    category_id: 1,
    bestseller: true,
    rating: 4.8,
    reviews: 47,
  },
  {
    id: 102,
    name: "طقم تخرج جامعي",
    price: 20,
    description: "هدية أنيقة للخريجين الجدد، مع طباعة الاسم وسنة التخرج",
    image_url: "/products/uni-grad-1.jpeg",
    gallery: ["/products/uni-grad-1.jpeg", "/products/uni-grad-2.jpeg", "/products/uni-grad-3.jpeg"],
    category_id: 1,
    bestseller: true,
    rating: 4.9,
    reviews: 63,
  },
  {
    id: 201,
    name: "طقم ترفيع ضابط",
    price: 25,
    description: "طقم تهنئة فاخر بالرتبة الجديدة، مع طباعة الاسم والشعار العسكري",
    image_url: "/products/promo-1.jpeg",
    gallery: ["/products/promo-1.jpeg", "/products/promo-2.jpeg"],
    category_id: 2,
    bestseller: false,
    rating: 4.7,
    reviews: 31,
  },
  {
    id: 301,
    name: "طقم يوم الأم الكلاسيكي",
    price: 18,
    description: "أجمل هدية لأحن الأمهات، يحتوي على لوحة مرآة مخصصة باسم الأم وعبارة محفورة، مع شمعة وفنجان قهوة مخصص",
    image_url: "/products/mom-1.jpeg",
    gallery: ["/products/mom-1.jpeg", "/products/mom-2.jpeg", "/products/mom-3.jpeg"],
    category_id: 3,
    bestseller: true,
    rating: 5.0,
    reviews: 89,
  },
  {
    id: 401,
    name: "طقم رمضان وعيد الفطر",
    price: 22,
    description: "بكجات هدايا رمضانية وعيدية فاخرة، تشمل سبحة، ماء زمزم، وبطاقات معايدة",
    image_url: "/products/ramadan-1.jpeg",
    gallery: ["/products/ramadan-1.jpeg", "/products/ramadan-2.jpeg", "/products/ramadan-3.jpeg"],
    category_id: 4,
    bestseller: false,
    rating: 4.6,
    reviews: 24,
  },
  {
    id: 501,
    name: "دلة بطباعة مخصصة",
    price: 30,
    description: "دلة قهوة فاخرة مع طباعة الاسم أو عبارة مخصصة، تأتي مع فناجين مطابقة",
    image_url: "/products/dallah-1.jpeg",
    gallery: ["/products/dallah-1.jpeg", "/products/dallah-2.jpeg", "/products/dallah-3.jpeg"],
    category_id: 5,
    bestseller: true,
    rating: 4.9,
    reviews: 56,
  },
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
