import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCart } from "../cart";
import { WHATSAPP_PHONE } from "../data";

export default function Checkout() {
  const { items, totalPriceText, clear } = useCart();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] mb-2">لا توجد منتجات لإتمام الطلب</h2>
        <p className="text-[#A87FD1] mb-6">أضيفي منتجات لسلتك أولاً</p>
        <Link href="/" className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A87FD1] transition">
            تصفحي المنتجات
          </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "يرجى إدخال الاسم";
    if (!phone.trim()) errs.phone = "يرجى إدخال رقم الهاتف";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const lines = [
      "🎁 طلب جديد من Lilac Gifts",
      "",
      `👤 الاسم: ${name}`,
      `📱 الهاتف: ${phone}`,
      "",
      "🛒 المنتجات:",
      ...items.map(
        ({ product, qty }) => `• ${product.name} × ${qty} — ${product.price}`,
      ),
      "",
      `💰 المجموع: ${totalPriceText}`,
    ];
    if (notes.trim()) {
      lines.push("", `📝 ملاحظات: ${notes}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
    clear();
    window.open(url, "_blank", "noopener,noreferrer");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#534AB7] mb-8">إتمام الطلب</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          <div>
            <label className="block text-[#534AB7] font-bold mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سارة أحمد"
              className={`w-full bg-white border-2 rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#534AB7] transition ${errors.name ? "border-red-400" : "border-[#EDE0F7]"}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[#534AB7] font-bold mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXX"
              dir="ltr"
              className={`w-full bg-white border-2 rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#534AB7] transition text-right ${errors.phone ? "border-red-400" : "border-[#EDE0F7]"}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-[#534AB7] font-bold mb-2">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="عنوان التوصيل، تفاصيل التخصيص (اسم/صورة)، موعد التسليم..."
              rows={4}
              className="w-full bg-white border-2 border-[#EDE0F7] rounded-2xl px-4 py-3 outline-none focus:border-[#534AB7] transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>تأكيد الطلب عبر واتساب</span>
            <span>💬</span>
          </button>

          <p className="text-center text-sm text-[#A87FD1]">
            سيتم تحويلك لتطبيق واتساب لتأكيد طلبك مع فريقنا
          </p>
        </form>

        <aside className="md:col-span-2">
          <div className="bg-[#EDE0F7] rounded-2xl p-5 sticky top-24">
            <h3 className="font-extrabold text-[#534AB7] text-lg mb-4">ملخص الطلب</h3>
            <div className="space-y-3 mb-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-[#2A1F3D]">
                    {product.name} <span className="text-[#A87FD1]">× {qty}</span>
                  </span>
                  <span className="text-[#534AB7] font-bold whitespace-nowrap">{product.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#C8A8E9]/40 pt-3 flex justify-between items-center">
              <span className="text-[#534AB7] font-semibold">المجموع</span>
              <span className="text-xl font-extrabold text-[#534AB7]">{totalPriceText}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
