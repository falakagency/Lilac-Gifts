import { Link } from "wouter";
import { categories, allProducts } from "../data";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featured = allProducts.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-[#EDE0F7] via-white to-[#EDE0F7]">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-block text-5xl mb-4 fade-up">🎁🌸</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#534AB7] mb-4 leading-tight slide-in-right">
            هدايا تحكي مشاعرك
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
              className="w-full sm:w-auto bg-white text-[#534AB7] border-2 border-[#C8A8E9] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#EDE0F7] btn-anim"
            >
              عرض السلة
            </Link>
          </div>
        </div>
        <div className="absolute top-10 right-10 text-6xl opacity-20 hidden md:block float-slow">🌷</div>
        <div className="absolute bottom-10 left-10 text-6xl opacity-20 hidden md:block float-slow">💜</div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10 fade-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] mb-2">تسوق حسب المناسبة</h2>
          <p className="text-[#A87FD1]">اختاري المناسبة وستجدين الهدية المثالية</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center justify-center bg-white border-2 border-[#EDE0F7] rounded-2xl p-6 hover:border-[#C8A8E9] hover:bg-[#EDE0F7] lift-anim shadow-sm fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-5xl mb-3 icon-anim">{cat.icon}</div>
              <div className="font-bold text-[#534AB7] text-center">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-[#EDE0F7]/40 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] mb-2">الأكثر طلباً</h2>
            <p className="text-[#A87FD1]">اختياراتنا المميزة لك</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
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
              className="bg-white p-6 rounded-2xl border border-[#EDE0F7] lift-anim fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="text-4xl mb-3 icon-anim">{f.icon}</div>
              <div className="font-bold text-[#534AB7] mb-1">{f.title}</div>
              <div className="text-sm text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
