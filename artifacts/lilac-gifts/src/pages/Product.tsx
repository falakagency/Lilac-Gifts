import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { findProduct, findCategoryByProduct, WHATSAPP_PHONE } from "../data";
import { useCart } from "../cart";

const GREETING_MAX = 150;

export default function Product() {
  const params = useParams();
  const id = Number(params.id);
  const product = findProduct(id);
  const category = findCategoryByProduct(id);
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);
  const [greeting, setGreeting] = useState("");

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🤷‍♀️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] mb-4">المنتج غير موجود</h2>
        <Link href="/" className="inline-block bg-[#534AB7] text-white px-6 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    navigate("/checkout");
  };

  const greetingTrim = greeting.trim();
  const whatsappLines = [
    "مرحباً Lilac Gifts 🌸",
    "أرغب بطلب:",
    `• ${product.name}`,
    `السعر: ${product.price}`,
    `الرابط: ${typeof window !== "undefined" ? window.location.href : ""}`,
  ];
  if (greetingTrim) {
    whatsappLines.push("", `💌 بطاقة التهنئة: ${greetingTrim}`);
  }
  const whatsappText = encodeURIComponent(whatsappLines.join("\n"));

  const remaining = GREETING_MAX - greeting.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link href="/" className="text-[#A87FD1] hover:text-[#534AB7]">الرئيسية</Link>
        {category && (
          <>
            <span className="text-[#C8A8E9]">/</span>
            <Link href={`/category/${category.id}`} className="text-[#A87FD1] hover:text-[#534AB7]">{category.name}</Link>
          </>
        )}
        <span className="text-[#C8A8E9]">/</span>
        <span className="text-[#534AB7] font-semibold">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-[#EDE0F7] rounded-3xl overflow-hidden aspect-square fade-up">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col fade-up delay-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] mb-3">{product.name}</h1>
          <div className="text-3xl font-bold text-[#A87FD1] mb-6">{product.price}</div>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">{product.desc}</p>

          <div className="bg-[#EDE0F7]/50 rounded-2xl p-4 mb-6 border border-[#EDE0F7]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div className="text-sm text-[#534AB7]">
                <div className="font-bold mb-1">قابل للتخصيص بالكامل</div>
                <div className="text-[#A87FD1]">يمكنك إضافة الاسم أو الصورة عبر واتساب بعد الطلب</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#534AB7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg"
            >
              اشتري الآن
            </button>

            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-2xl font-bold text-lg btn-anim shadow border-2 ${
                added
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white text-[#534AB7] border-[#C8A8E9] hover:bg-[#EDE0F7]"
              }`}
            >
              {added ? "✓ تمت الإضافة للسلة" : "أضف إلى السلة"}
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] btn-anim shadow flex items-center justify-center gap-2"
            >
              <span>اطلب عبر واتساب</span>
              <span>💬</span>
            </a>
          </div>

          {/* Greeting Card */}
          <div className="mt-8 bg-white rounded-2xl border-2 border-[#EDE0F7] p-5 shadow-sm hover:border-[#C8A8E9] transition-colors duration-300 fade-up delay-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[#534AB7] text-lg flex items-center gap-2">
                أضف بطاقة تهنئة <span className="text-2xl">💌</span>
              </h3>
            </div>
            <p className="text-xs text-[#A87FD1] mb-3">
              اكتبي رسالتك وسنرفقها مع الهدية — ستضاف تلقائياً لطلب واتساب.
            </p>
            <textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value.slice(0, GREETING_MAX))}
              placeholder="مثال: كل عام وأنتِ بألف خير يا أمي ❤️"
              rows={3}
              maxLength={GREETING_MAX}
              className="w-full bg-[#EDE0F7]/30 border-2 border-[#EDE0F7] rounded-xl px-4 py-3 outline-none focus:border-[#534AB7] focus:bg-white transition-all duration-300 resize-none text-[#2A1F3D]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#A87FD1]">
                {greetingTrim ? "✓ سيتم إرفاقها مع طلبك" : "اختياري"}
              </span>
              <span
                className={`text-xs font-semibold ${
                  remaining < 20 ? "text-[#A87FD1]" : "text-gray-400"
                }`}
              >
                {greeting.length} / {GREETING_MAX}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
