import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCart } from "../cart";
import { GOOGLE_SHEETS_WEBHOOK_URL } from "../data";

type DeliveryKey = "city" | "village";

const DELIVERY_OPTIONS: Array<{
  key: DeliveryKey;
  label: string;
  cost: number;
  desc: string;
}> = [
  { key: "city", label: "داخل المدن الرئيسية", cost: 3, desc: "عمّان، الزرقاء، إربد، السلط، مادبا" },
  { key: "village", label: "داخل القرى البعيدة", cost: 4, desc: "باقي المناطق والقرى" },
];

const CLIQ = {
  number: "0781169255",
  name: "دينا زهير الابطح",
  bank: "العربي الإسلامي",
};

const REQUIRED_MSG = "هذا الحقل مطلوب";

export default function Checkout() {
  const { items, totalPriceNumber, clear } = useCart();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocationField] = useState("");
  const [notes, setNotes] = useState("");
  const [delivery, setDelivery] = useState<DeliveryKey>("city");
  const [payment, setPayment] = useState<"cliq" | "cash">("cliq");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; location?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; location?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: "name" | "phone" | "location", value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: value.trim() ? undefined : REQUIRED_MSG,
    }));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-2">لا توجد منتجات لإتمام الطلب</h2>
        <p className="text-[#A87FD1] mb-6">أضيفي منتجات لسلتك أولاً</p>
        <Link href="/" className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim">
          تصفحي المنتجات
        </Link>
      </div>
    );
  }

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.key === delivery)!;
  const subtotal = totalPriceNumber;
  const total = subtotal + deliveryOption.cost;
  const fmt = (n: number) => `${n.toFixed(2)} د.أ`;

  const isFormValid = name.trim() !== "" && phone.trim() !== "" && location.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const errs: { name?: string; phone?: string; location?: string } = {};
    if (!name.trim()) errs.name = REQUIRED_MSG;
    if (!phone.trim()) errs.phone = REQUIRED_MSG;
    if (!location.trim()) errs.location = REQUIRED_MSG;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    const orderNumber = `#LG-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = now.toLocaleTimeString("ar-JO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build a clear products string: each product on its own line, with customization on the next line
    const productBlocks = items.map(({ product, qty, customization }, idx) => {
      const header = `Product ${idx + 1}: ${product.name} × ${qty} - ${product.price}`;
      const cust = (customization ?? "").trim();
      const customLine = `Customization: ${cust ? cust : "—"}`;
      return `${header}\n${customLine}`;
    });
    const productsText = productBlocks.join("\n\n");

    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      const sheetPayload = {
        orderNumber,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerLocation: location.trim(),
        products: productsText,
        productsDetailed: items.map(({ product, qty, customization }) => ({
          name: product.name,
          qty,
          price: product.price,
          customization: (customization ?? "").trim(),
        })),
        total: fmt(total),
        subtotal: fmt(subtotal),
        deliveryCost: fmt(deliveryOption.cost),
        delivery: deliveryOption.label,
        payment: payment === "cliq" ? "كلك" : "كاش عند الاستلام",
        notes: notes.trim(),
        date: dateStr,
        time: timeStr,
        dateTime: `${dateStr} - ${timeStr}`,
      };
      fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(sheetPayload),
      }).catch((err) => {
        console.error("[Sheets] Failed to log order:", err);
      });
    }

    try {
      sessionStorage.setItem(
        "lilac-last-order",
        JSON.stringify({
          number: orderNumber,
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          total: fmt(total),
          subtotal: fmt(subtotal),
          delivery: deliveryOption.label,
          deliveryCost: fmt(deliveryOption.cost),
          payment: payment === "cliq" ? "كلك" : "كاش عند الاستلام",
          notes: notes.trim(),
          items: items.map(({ product, qty, customization }) => ({
            name: product.name,
            price: product.price,
            qty,
            customization: (customization ?? "").trim(),
          })),
          createdAt: now.toISOString(),
        }),
      );
    } catch {
      // ignore
    }

    clear();
    navigate("/confirmation");
  };

  const inputBase =
    "w-full bg-white dark:bg-[#1a1a2e] text-[#2A1F3D] dark:text-[#eee] border-2 rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9] transition";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-8">إتمام الطلب</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5" noValidate>
          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-2">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name || errors.name) validateField("name", e.target.value);
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, name: true }));
                validateField("name", name);
              }}
              placeholder="مثال: سارة أحمد"
              className={`${inputBase} ${errors.name ? "border-red-400" : "border-[#EDE0F7] dark:border-[#2a2f4a]"}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-2">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (touched.phone || errors.phone) validateField("phone", e.target.value);
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, phone: true }));
                validateField("phone", phone);
              }}
              placeholder="07XXXXXXXX"
              dir="ltr"
              className={`${inputBase} text-right ${errors.phone ? "border-red-400" : "border-[#EDE0F7] dark:border-[#2a2f4a]"}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-2">
              الموقع / العنوان 📍 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocationField(e.target.value);
                if (touched.location || errors.location) validateField("location", e.target.value);
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, location: true }));
                validateField("location", location);
              }}
              placeholder="مثال: عمان، الجبيهة، شارع الجامعة..."
              className={`${inputBase} ${errors.location ? "border-red-400" : "border-[#EDE0F7] dark:border-[#2a2f4a]"}`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-3">
              🚚 اختاري طريقة التوصيل
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {DELIVERY_OPTIONS.map((opt) => {
                const active = delivery === opt.key;
                return (
                  <label
                    key={opt.key}
                    className={`cursor-pointer rounded-2xl border-2 p-4 btn-anim flex items-start gap-3 ${
                      active
                        ? "border-[#534AB7] bg-[#EDE0F7] dark:bg-[#2a2f4a] shadow-md"
                        : "border-[#EDE0F7] dark:border-[#2a2f4a] bg-white dark:bg-[#16213e] hover:border-[#C8A8E9]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.key}
                      checked={active}
                      onChange={() => setDelivery(opt.key)}
                      className="mt-1 accent-[#534AB7]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9] flex justify-between gap-2">
                        <span>{opt.label}</span>
                        <span className="text-sm bg-[#534AB7] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                          {opt.cost} د.أ
                        </span>
                      </div>
                      <div className="text-xs text-[#A87FD1] mt-1">{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-3">
              💰 طريقة الدفع
            </label>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {([
                { key: "cliq" as const, icon: "💳", label: "كلك", desc: "تحويل بنكي إلكتروني" },
                { key: "cash" as const, icon: "💵", label: "كاش عند الاستلام", desc: "ادفعي للمندوب عند التسليم" },
              ]).map((opt) => {
                const active = payment === opt.key;
                return (
                  <label
                    key={opt.key}
                    className={`cursor-pointer rounded-2xl border-2 p-4 btn-anim flex items-start gap-3 ${
                      active
                        ? "border-[#534AB7] bg-[#EDE0F7] dark:bg-[#2a2f4a] shadow-md"
                        : "border-[#EDE0F7] dark:border-[#2a2f4a] bg-white dark:bg-[#16213e] hover:border-[#C8A8E9]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.key}
                      checked={active}
                      onChange={() => setPayment(opt.key)}
                      className="mt-1 accent-[#534AB7]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9] flex items-center gap-2">
                        <span className="text-xl">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </div>
                      <div className="text-xs text-[#A87FD1] mt-1">{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {payment === "cliq" ? (
              <div className="rounded-2xl border-2 border-[#C8A8E9] dark:border-[#534AB7] bg-gradient-to-bl from-[#EDE0F7] via-white to-[#EDE0F7] dark:from-[#16213e] dark:via-[#1a1a2e] dark:to-[#16213e] p-5 shadow-sm fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💳</span>
                  <h3 className="font-extrabold text-[#534AB7] dark:text-[#C8A8E9] text-lg">
                    الدفع عبر كلك (Cliq)
                  </h3>
                </div>
                <div className="space-y-2 bg-white/70 dark:bg-[#1a1a2e]/60 rounded-xl p-4 border border-[#C8A8E9]/40 dark:border-[#2a2f4a]">
                  <div className="flex justify-between gap-2 border-b border-[#EDE0F7] dark:border-[#2a2f4a] pb-2">
                    <span className="text-[#A87FD1] font-semibold text-sm">رقم الكلك</span>
                    <a
                      href={`tel:${CLIQ.number}`}
                      dir="ltr"
                      className="font-bold text-[#534AB7] dark:text-[#C8A8E9] tracking-wider"
                    >
                      {CLIQ.number}
                    </a>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-[#EDE0F7] dark:border-[#2a2f4a] pb-2">
                    <span className="text-[#A87FD1] font-semibold text-sm">الاسم</span>
                    <span className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{CLIQ.name}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#A87FD1] font-semibold text-sm">البنك</span>
                    <span className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{CLIQ.bank}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#534AB7] dark:text-[#C8A8E9] bg-[#C8A8E9]/30 dark:bg-[#2a2f4a] rounded-xl p-3 flex items-start gap-2">
                  <span className="text-lg">📸</span>
                  <span>أرسل صورة الحوالة على واتساب بعد الدفع.</span>
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-[#C8A8E9] dark:border-[#534AB7] bg-gradient-to-bl from-[#EDE0F7] via-white to-[#EDE0F7] dark:from-[#16213e] dark:via-[#1a1a2e] dark:to-[#16213e] p-5 shadow-sm fade-up flex items-start gap-3">
                <span className="text-3xl">💵</span>
                <div>
                  <h3 className="font-extrabold text-[#534AB7] dark:text-[#C8A8E9] text-lg mb-1">
                    كاش عند الاستلام
                  </h3>
                  <p className="text-sm text-[#534AB7] dark:text-[#C8A8E9]">
                    سيتم تحصيل المبلغ عند التوصيل.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-2">ملاحظات (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="موعد التسليم، أي تفاصيل إضافية..."
              rows={4}
              className={`${inputBase} border-[#EDE0F7] dark:border-[#2a2f4a] resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className="w-full bg-[#534AB7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#534AB7]"
          >
            <span>{submitting ? "جارٍ الإرسال..." : "إتمام الطلب"}</span>
            {!submitting && <span>✓</span>}
          </button>
          {!isFormValid && !submitting && (
            <p className="text-xs text-[#A87FD1] text-center -mt-2">
              يرجى تعبئة الاسم ورقم الهاتف والموقع لإتمام الطلب
            </p>
          )}
        </form>

        <aside className="md:col-span-2">
          <div className="bg-[#EDE0F7] dark:bg-[#16213e] dark:border dark:border-[#2a2f4a] rounded-2xl p-5 sticky top-24">
            <h3 className="font-extrabold text-[#534AB7] dark:text-[#C8A8E9] text-lg mb-4">ملخص الطلب</h3>
            <div className="space-y-3 mb-4">
              {items.map(({ id, product, qty, customization }) => (
                <div key={id} className="text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#2A1F3D] dark:text-[#eee]">
                      {product.name} <span className="text-[#A87FD1]">× {qty}</span>
                    </span>
                    <span className="text-[#534AB7] dark:text-[#C8A8E9] font-bold whitespace-nowrap">{product.price}</span>
                  </div>
                  {customization && (
                    <div className="text-xs text-[#A87FD1] mt-0.5 pr-2 break-words">
                      ✏️ {customization}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-[#C8A8E9]/40 dark:border-[#2a2f4a] pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A87FD1]">المجموع الفرعي</span>
                <span className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A87FD1]">🚚 التوصيل ({deliveryOption.label})</span>
                <span className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{fmt(deliveryOption.cost)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#C8A8E9]/40 dark:border-[#2a2f4a]">
                <span className="text-[#534AB7] dark:text-[#C8A8E9] font-semibold">المجموع الكلي</span>
                <span className="text-xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9]">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
