import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  categories,
  allProducts,
  bestsellerProducts,
  filterByBudget,
  type BudgetFilterValue,
} from "../data";
import ProductCard from "../components/ProductCard";
import BudgetFilter from "../components/BudgetFilter";
import CountdownCard from "../components/CountdownCard";
import Petals from "../components/Petals";

const HERO_TEXT = "هدايا مخصصة لكل مناسبة";
const TYPE_SPEED = 80;
const CURSOR_HIDE_DELAY = 2000;

function useTypewriter(text: string) {
  const [shown, setShown] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setShown("");
    setShowCursor(true);
    let i = 0;
    const chars = Array.from(text);
    const id = window.setInterval(() => {
      i += 1;
      setShown(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        window.clearInterval(id);
        window.setTimeout(() => setShowCursor(false), CURSOR_HIDE_DELAY);
      }
    }, TYPE_SPEED);
    return () => window.clearInterval(id);
  }, [text]);

  return { shown, showCursor };
}

export default function Home() {
  const [budget, setBudget] = useState<BudgetFilterValue>("all");
  const { shown: heroText, showCursor: heroCursor } = useTypewriter(HERO_TEXT);

  const filtered = filterByBudget(allProducts, budget);
  const featured = filtered.slice(0, 4);
  const bestsellers = bestsellerProducts.slice(0, 4);

  return (
    <div>
      <Petals />
      {/* Hero */}
      <section className="relative overflow-hidden hero-morph dark:bg-gradient-to-bl dark:from-[#16213e] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-block text-5xl mb-4 fade-up">🎁🌸</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-4 leading-tight min-h-[1.2em]">
            <span>{heroText}</span>
            <span
              aria-hidden="true"
              className={`typewriter-cursor ${heroCursor ? "" : "typewriter-cursor--hidden"}`}
            />
          </h1>
          <p className="text-lg sm:text-xl text-[#A87FD1] max-w-2xl mx-auto mb-8 leading-relaxed fade-up delay-200">
            مجموعات هدايا مخصصة لكل مناسبة — من التخرج والترفيعات إلى يوم الأم ورمضان. اطلب عبر واتساب وسنوصلها لك في الأردن.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 fade-up delay-400">
            <a
              href="#categories"
              className="w-full sm:w-auto bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg"
            >
              تسوق الآن
            </a>
            <Link
              href="/cart"
              className="w-full sm:w-auto bg-white dark:bg-[#16213e] text-[#534AB7] dark:text-[#C8A8E9] border-2 border-[#C8A8E9] dark:border-[#2a2f4a] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
            >
              عرض السلة
            </Link>
          </div>
        </div>
        <div className="absolute top-10 right-10 text-6xl opacity-20 hidden md:block float-slow">🌷</div>
        <div className="absolute bottom-10 left-10 text-6xl opacity-20 hidden md:block float-slow">💜</div>
      </section>

      {/* Countdown to next occasion */}
      <CountdownCard />

      {/* Categories */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10 fade-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">تسوق حسب المناسبة</h2>
          <p className="text-[#A87FD1]">اختاري المناسبة وستجدين الهدية المثالية</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center justify-center bg-white dark:bg-[#16213e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-2xl p-6 hover:border-[#C8A8E9] hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] lift-anim shadow-sm fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-5xl mb-3 icon-anim">{cat.icon}</div>
              <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9] text-center">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Most Ordered (Bestsellers) */}
      <section className="bg-gradient-to-bl from-[#EDE0F7]/70 to-white dark:from-[#16213e] dark:to-[#1a1a2e] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">
              الأكثر طلباً 🔥
            </h2>
            <p className="text-[#A87FD1]">المنتجات التي يحبها عملاؤنا أكثر</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured with budget filter */}
      <section className="bg-[#EDE0F7]/40 dark:bg-[#16213e]/60 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">تسوق حسب الميزانية</h2>
            <p className="text-[#A87FD1]">اختاري ميزانيتك وستجدين الهدية المناسبة</p>
          </div>

          <BudgetFilter value={budget} onChange={setBudget} />

          {featured.length === 0 ? (
            <div className="text-center py-12 text-[#A87FD1] fade-up">
              <div className="text-4xl mb-2">🌷</div>
              لا توجد منتجات ضمن هذه الميزانية حالياً
            </div>
          ) : (
            <div
              key={budget}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {featured.map((p, i) => (
                <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: "✨", title: "تخصيص كامل", desc: "اطبع الاسم أو الصورة على هديتك" },
            { icon: "🚚", title: "توصيل لكل الأردن", desc: "نوصل لجميع المحافظات" },
            { icon: "💬", title: "اطلب عبر واتساب", desc: "تواصل مباشر وسريع معنا" },
          ].map((f, i) => (
            <div
              key={f.title}
              className="bg-white dark:bg-[#16213e] p-6 rounded-2xl border border-[#EDE0F7] dark:border-[#2a2f4a] lift-anim fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="text-4xl mb-3 icon-anim">{f.icon}</div>
              <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">{f.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
