export type Product = {
  id: number;
  name: string;
  price: string;
  desc: string;
  img: string;
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
      { id: 101, name: "طقم تخرج أمن عام", price: "15 د.أ", desc: "طقم هدايا مخصص لمناسبة التخرج", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=تخرج" },
      { id: 102, name: "طقم تخرج جامعي", price: "20 د.أ", desc: "هدية أنيقة للخريجين الجدد", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=جامعة" },
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
      { id: 301, name: "طقم يوم الأم الكلاسيكي", price: "18 د.أ", desc: "أجمل هدية لأحن الأمهات", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=الأم" },
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
      { id: 501, name: "دلة بطباعة مخصصة", price: "30 د.أ", desc: "اطبع اسمك أو صورتك", img: "https://placehold.co/300x300/EDE0F7/534AB7?text=دلة" },
    ],
  },
];

export const allProducts: Product[] = categories.flatMap((c) => c.products);

export function findProduct(id: number): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function findCategory(id: number): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function findCategoryByProduct(productId: number): Category | undefined {
  return categories.find((c) => c.products.some((p) => p.id === productId));
}

export const WHATSAPP_PHONE = "962781747824";
