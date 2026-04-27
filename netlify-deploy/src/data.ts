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
