import { Link, useParams, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { WHATSAPP_PHONE } from "../data";
import { useCatalog } from "../lib/catalog";
import { useCart } from "../cart";
import Stars from "../components/Stars";
import ShareButton from "../components/ShareButton";

const GREETING_MAX = 150;
const CUSTOM_MAX = 200;

function ProductGallery({ product }: { product: import("../data").Product }) {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.img];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-[#EDE0F7] dark:bg-[#16213e] rounded-3xl overflow-hidden aspect-square">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${product.name} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="gift-overlay" aria-hidden="true">
          <span>🎁</span>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`الصورة ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-7 bg-[#534AB7] shadow"
                    : "w-2.5 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 btn-anim ${
                i === active
                  ? "border-[#534AB7] shadow ring-2 ring-[#C8A8E9]/50"
                  : "border-[#EDE0F7] dark:border-[#2a2f4a] opacity-70 hover:opacity-100"
              }`}
              aria-label={`عرض الصورة ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Product() {
  const params = useParams();
  const id = Number(params.id);
  const { findProduct, findCategoryByProduct, loading } = useCatalog();
  const product = findProduct(id);
  const category = findCategoryByProduct(id);
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [customization, setCustomization] = useState("");
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  if (loading && !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#A87FD1]">
        جارٍ تحميل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🤷‍♀️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-4">المنتج غير موجود</h2>
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

    const confetti = (window as unknown as { confetti?: (opts: Record<string, unknown>) => void }).confetti;
    if (confetti) {
      const btn = addBtnRef.current;
      const colors = ["#C8A8E9", "#534AB7", "#EDE0F7", "#ffffff"];
      let origin: { x: number; y: number } = { x: 0.5, y: 0.6 };
      if (btn) {
        const rect = btn.getBoundingClientRect();
        origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        };
      }
      const duration = 1500;
      const end = Date.now() + duration;
      confetti({
        particleCount: 80,
        spread: 75,
        startVelocity: 45,
        origin,
        colors,
        scalar: 1.05,
        zIndex: 9999,
      });
      const interval = window.setInterval(() => {
        if (Date.now() > end) {
          window.clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 18,
          spread: 60,
          startVelocity: 30,
          origin,
          colors,
          scalar: 0.9,
          zIndex: 9999,
        });
      }, 220);
    }
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    navigate("/checkout");
  };

  const greetingTrim = greeting.trim();
  const customizationTrim = customization.trim();
  const whatsappLines = [
    "مرحباً Lilac Gifts 🌸",
    "أرغب بطلب:",
    `• ${product.name}`,
    `السعر: ${product.price}`,
    `الرابط: ${typeof window !== "undefined" ? window.location.href : ""}`,
  ];
  if (customizationTrim) {
    whatsappLines.push("", `✏️ تفاصيل التخصيص: ${customizationTrim}`);
  }
  if (greetingTrim) {
    whatsappLines.push("", `💌 بطاقة التهنئة: ${greetingTrim}`);
  }
  const whatsappText = encodeURIComponent(whatsappLines.join("\n"));

  const remaining = GREETING_MAX - greeting.length;
  const customRemaining = CUSTOM_MAX - customization.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link href="/" className="text-[#A87FD1] hover:text-[#534AB7] dark:hover:text-[#C8A8E9]">الرئيسية</Link>
        {category && (
          <>
            <span className="text-[#C8A8E9]">/</span>
            <Link href={`/category/${category.id}`} className="text-[#A87FD1] hover:text-[#534AB7] dark:hover:text-[#C8A8E9]">{category.name}</Link>
          </>
        )}
        <span className="text-[#C8A8E9]">/</span>
        <span className="text-[#534AB7] dark:text-[#C8A8E9] font-semibold">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery product={product} />


        <div className="flex flex-col fade-up delay-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-3">{product.name}</h1>
          <div className="mb-4">
            <Stars rating={product.rating} reviews={product.reviews} size="md" />
          </div>
          <div className="text-3xl font-bold text-[#A87FD1] mb-6">{product.price}</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{product.desc}</p>

          <div className="bg-[#EDE0F7]/50 dark:bg-[#16213e] rounded-2xl p-4 mb-6 border border-[#EDE0F7] dark:border-[#2a2f4a]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div className="text-sm text-[#534AB7] dark:text-[#C8A8E9]">
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
              ref={addBtnRef}
              onClick={handleAdd}
              className={`w-full py-4 rounded-2xl font-bold text-lg btn-anim shadow border-2 ${
                added
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white dark:bg-[#16213e] text-[#534AB7] dark:text-[#C8A8E9] border-[#C8A8E9] dark:border-[#2a2f4a] hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a]"
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

            <ShareButton title={product.name} text={`${product.name} — ${product.price}`} />
          </div>

          {/* Product Customization */}
          <div className="mt-8 bg-white dark:bg-[#16213e] rounded-2xl border-2 border-[#C8A8E9]/60 dark:border-[#2a2f4a] p-5 shadow-sm hover:border-[#534AB7] transition-colors duration-300 fade-up delay-150">
            <h3 className="font-extrabold text-[#534AB7] dark:text-[#C8A8E9] text-lg flex items-center gap-2 mb-2">
              <span>✏️</span>
              <span>خصص منتجك</span>
            </h3>
            <p className="text-xs text-[#A87FD1] mb-3">
              ما تكتبينه هنا سيُطبع على المنتج وسيضاف تلقائياً لطلب واتساب.
            </p>
            <textarea
              value={customization}
              onChange={(e) => setCustomization(e.target.value.slice(0, CUSTOM_MAX))}
              placeholder="اكتب هنا ما تريد طباعته على المنتج (اسم، كلمة، تاريخ...)"
              rows={3}
              maxLength={CUSTOM_MAX}
              className="w-full bg-[#EDE0F7]/30 dark:bg-[#1a1a2e] border-2 border-[#C8A8E9]/60 dark:border-[#2a2f4a] rounded-xl px-4 py-3 outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9] focus:bg-white dark:focus:bg-[#1a1a2e] transition-all duration-300 resize-none text-[#2A1F3D] dark:text-[#eee]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#A87FD1]">
                {customizationTrim ? "✓ سيتم طباعتها على المنتج" : "اختياري"}
              </span>
              <span
                className={`text-xs font-semibold ${
                  customRemaining < 30 ? "text-[#A87FD1]" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {customization.length} / {CUSTOM_MAX}
              </span>
            </div>
          </div>

          {/* Greeting Card */}
          <div className="mt-8 bg-white dark:bg-[#16213e] rounded-2xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-5 shadow-sm hover:border-[#C8A8E9] transition-colors duration-300 fade-up delay-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[#534AB7] dark:text-[#C8A8E9] text-lg flex items-center gap-2">
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
              className="w-full bg-[#EDE0F7]/30 dark:bg-[#1a1a2e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-xl px-4 py-3 outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9] focus:bg-white dark:focus:bg-[#1a1a2e] transition-all duration-300 resize-none text-[#2A1F3D] dark:text-[#eee]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#A87FD1]">
                {greetingTrim ? "✓ سيتم إرفاقها مع طلبك" : "اختياري"}
              </span>
              <span
                className={`text-xs font-semibold ${
                  remaining < 20 ? "text-[#A87FD1]" : "text-gray-400 dark:text-gray-500"
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
