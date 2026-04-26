import amnAamGraduationImg from "@assets/WhatsApp_Image_2026-04-23_at_8.13.32_PM_1776964703507.jpeg";
import uniGrad1 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.28_PM_(2)_1776965067951.jpeg";
import uniGrad2 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.28_PM_(3)_1776965067952.jpeg";
import uniGrad3 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.28_PM_1776965067954.jpeg";
import dallah1 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.22_PM_(1)_1776965118077.jpeg";
import dallah2 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.22_PM_1776965118078.jpeg";
import dallah3 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.24_PM_1776965118079.jpeg";
import mom1 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.25_PM_1776965217832.jpeg";
import mom2 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.25_PM_(1)_1776965217833.jpeg";
import mom3 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.25_PM_(2)_1776965217835.jpeg";
import promo1 from "@assets/WhatsApp_Image_2026-04-23_at_8.13.33_PM_(1)_1776965262160.jpeg";
import promo2 from "@assets/WhatsApp_Image_2026-04-23_at_8.13.33_PM_(2)_1776965262162.jpeg";
import ramadan1 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.26_PM_(2)_1776965296097.jpeg";
import ramadan2 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.26_PM_1776965296099.jpeg";
import ramadan3 from "@assets/WhatsApp_Image_2026-04-23_at_8.23.25_PM_(3)_1776965296100.jpeg";

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

export const categories: Category[] = [
  {
    id: 1,
    name: "التخرج",
    icon: "🎓",
    products: [
      { id: 101, name: "طقم تخرج أمن عام", price: "15 د.أ", desc: "طقم هدايا مخصص لمناسبة التخرج، مع طباعة اسم الخريج", img: amnAamGraduationImg, bestseller: true, rating: 4.8, reviews: 47 },
      { id: 102, name: "طقم تخرج جامعي", price: "20 د.أ", desc: "هدية أنيقة للخريجين الجدد، مع طباعة الاسم وسنة التخرج", img: uniGrad2, gallery: [uniGrad2, uniGrad1, uniGrad3], bestseller: true, rating: 4.9, reviews: 63 },
    ],
  },
  {
    id: 2,
    name: "ترفيعات عسكرية",
    icon: "⭐",
    products: [
      { id: 201, name: "طقم ترفيع ضابط", price: "25 د.أ", desc: "طقم تهنئة فاخر بالرتبة الجديدة، مع طباعة الاسم والشعار العسكري بتصميم مخصص", img: promo1, gallery: [promo1, promo2], rating: 4.7, reviews: 31 },
    ],
  },
  {
    id: 3,
    name: "يوم الأم",
    icon: "🌸",
    products: [
      { id: 301, name: "طقم يوم الأم الكلاسيكي", price: "18 د.أ", desc: "أجمل هدية لأحن الأمهات، يحتوي على لوحة مرآة مخصصة باسم الأم وعبارة محفورة، مع شمعة وفنجان قهوة مخصص", img: mom1, gallery: [mom1, mom2, mom3], bestseller: true, rating: 5.0, reviews: 89 },
    ],
  },
  {
    id: 4,
    name: "رمضان وعيد الفطر",
    icon: "🌙",
    products: [
      { id: 401, name: "طقم رمضان وعيد الفطر", price: "22 د.أ", desc: "بكجات هدايا رمضانية وعيدية فاخرة، تشمل سبحة، ماء زمزم، وبطاقات معايدة بتصميم مخصص", img: ramadan1, gallery: [ramadan1, ramadan2, ramadan3], rating: 4.6, reviews: 24 },
    ],
  },
  {
    id: 5,
    name: "دلات وفناجين",
    icon: "☕",
    products: [
      { id: 501, name: "دلة بطباعة مخصصة", price: "30 د.أ", desc: "دلة قهوة فاخرة مع طباعة الاسم أو عبارة مخصصة، تأتي مع فناجين مطابقة", img: dallah1, gallery: [dallah1, dallah2, dallah3], bestseller: true, rating: 4.9, reviews: 56 },
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

export const CONTACT_PHONE_LOCAL = "0782859651";
export const CONTACT_PHONE_INTL = "962782859651";
export const WHATSAPP_PHONE = "962782859651";
export const INSTAGRAM_URL = "https://www.instagram.com/lilac_gifts2022?igsh=MWNvOGJoMnh6NHVmZQ==";

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
