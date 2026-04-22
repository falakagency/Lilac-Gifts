import { useState } from "react";
import { Link, useParams } from "wouter";
import { findCategory, filterByBudget, type BudgetFilterValue } from "../data";
import ProductCard from "../components/ProductCard";
import BudgetFilter from "../components/BudgetFilter";

export default function Category() {
  const params = useParams();
  const id = Number(params.id);
  const category = findCategory(id);
  const [budget, setBudget] = useState<BudgetFilterValue>("all");

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🤷‍♀️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-4">القسم غير موجود</h2>
        <Link
          href="/"
          className="inline-block bg-[#534AB7] text-white px-6 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const filtered = filterByBudget(category.products, budget);

  return (
    <div>
      <div className="bg-gradient-to-bl from-[#EDE0F7] to-white dark:from-[#16213e] dark:to-[#1a1a2e] py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-6xl mb-3 float-slow">{category.icon}</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">{category.name}</h1>
          <p className="text-[#A87FD1]">{category.products.length} منتجات متوفرة</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-[#534AB7] dark:text-[#C8A8E9] font-semibold hover:underline">
            ← العودة للرئيسية
          </Link>
        </div>

        <BudgetFilter value={budget} onChange={setBudget} />

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#A87FD1] fade-up">
            <div className="text-4xl mb-2">🌷</div>
            لا توجد منتجات ضمن هذه الميزانية حالياً
          </div>
        ) : (
          <div key={budget} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
