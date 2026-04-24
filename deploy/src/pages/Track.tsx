import { useState } from "react";
import { Link } from "wouter";
import { WHATSAPP_PHONE } from "../data";

type Step = {
  key: string;
  icon: string;
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  { key: "received", icon: "✅", title: "تم استلام الطلب", desc: "وصلنا طلبك بنجاح وبدأنا بمعالجته" },
  { key: "preparing", icon: "🔄", title: "جاري التحضير", desc: "فريقنا يجهز هديتك بعناية" },
  { key: "shipping", icon: "📦", title: "جاري التوصيل", desc: "الهدية في الطريق إليكِ" },
  { key: "delivered", icon: "✅", title: "تم التسليم", desc: "وصلت الهدية. نتمنى أن تنال إعجابك 🌸" },
];

// Hardcoded current step (0-based). Update later when integrating real backend.
const CURRENT_STEP = 1;

export default function Track() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `مرحباً Lilac Gifts 🌸\nأرغب بالاستفسار عن حالة طلبي.\nرقم الهاتف: ${phone || "—"}`,
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8 fade-up">
        <div className="text-5xl mb-2">📦</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">
          تتبعي طلبك
        </h1>
        <p className="text-[#A87FD1]">أدخلي رقم هاتفك لمتابعة حالة طلبك خطوة بخطوة</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#16213e] rounded-3xl p-5 sm:p-6 border-2 border-[#EDE0F7] dark:border-[#2a2f4a] shadow-sm fade-up delay-100"
      >
        <label className="block text-[#534AB7] dark:text-[#C8A8E9] font-bold mb-2">
          رقم الطلب (رقم الهاتف)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX"
            dir="ltr"
            className="flex-1 bg-[#EDE0F7]/30 dark:bg-[#1a1a2e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9] transition text-right text-[#2A1F3D] dark:text-[#eee]"
          />
          <button
            type="submit"
            className="bg-[#534AB7] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#A87FD1] btn-anim shadow"
          >
            تتبع الطلب
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mt-8 bg-white dark:bg-[#16213e] rounded-3xl p-6 border-2 border-[#EDE0F7] dark:border-[#2a2f4a] shadow-sm fade-up">
          <div className="mb-6">
            <div className="text-sm text-[#A87FD1] mb-1">رقم الطلب</div>
            <div className="text-lg font-bold text-[#534AB7] dark:text-[#C8A8E9]" dir="ltr">
              {phone}
            </div>
          </div>

          <ol className="relative">
            {STEPS.map((step, i) => {
              const done = i < CURRENT_STEP;
              const active = i === CURRENT_STEP;
              const upcoming = i > CURRENT_STEP;
              const isLast = i === STEPS.length - 1;
              return (
                <li key={step.key} className="relative pr-12 pb-6 fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                  {!isLast && (
                    <span
                      className={`absolute right-[18px] top-10 bottom-0 w-0.5 ${
                        done ? "bg-[#534AB7]" : "bg-[#EDE0F7] dark:bg-[#2a2f4a]"
                      }`}
                    />
                  )}
                  <div
                    className={`absolute right-0 top-1 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md border-2 ${
                      done
                        ? "bg-[#534AB7] border-[#534AB7] text-white"
                        : active
                          ? "bg-[#C8A8E9] border-[#534AB7] text-white pulse-soft"
                          : "bg-white dark:bg-[#1a1a2e] border-[#EDE0F7] dark:border-[#2a2f4a] text-gray-400"
                    }`}
                  >
                    {done ? "✓" : step.icon}
                  </div>
                  <div className={upcoming ? "opacity-50" : ""}>
                    <div
                      className={`font-extrabold mb-1 ${
                        active
                          ? "text-[#534AB7] dark:text-[#C8A8E9] text-lg"
                          : "text-[#2A1F3D] dark:text-[#eee]"
                      }`}
                    >
                      {step.title}
                      {active && (
                        <span className="mr-2 text-xs bg-[#EDE0F7] dark:bg-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] px-2 py-0.5 rounded-full">
                          الحالة الحالية
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</div>
                  </div>
                </li>
              );
            })}
          </ol>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] btn-anim shadow flex items-center justify-center gap-2"
          >
            <span>تواصل معنا للاستفسار</span>
            <span>💬</span>
          </a>
        </div>
      )}

      {!submitted && (
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#534AB7] dark:text-[#C8A8E9] font-semibold hover:underline"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      )}
    </div>
  );
}
