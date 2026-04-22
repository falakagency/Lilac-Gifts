import { Link, useParams } from "wouter";
import { findCategory } from "../data";
import ProductCard from "../components/ProductCard";

export default function Category() {
  const params = useParams();
  const id = Number(params.id);
  const category = findCategory(id);

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🤷‍♀️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] mb-4">القسم غير موجود</h2>
        <Link href="/" className="inline-block bg-[#534AB7] text-white px-6 py-3 rounded-full font-bold hover:bg-[#A87FD1] transition">
            العودة للرئيسية
          </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-bl from-[#EDE0F7] to-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-6xl mb-3">{category.icon}</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#534AB7] mb-2">{category.name}</h1>
          <p className="text-[#A87FD1]">{category.products.length} منتجات متوفرة</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-[#534AB7] font-semibold hover:underline">← العودة للرئيسية</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
