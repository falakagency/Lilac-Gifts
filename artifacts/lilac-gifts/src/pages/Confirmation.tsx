import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { WHATSAPP_PHONE, GOOGLE_SHEETS_WEBHOOK_URL } from "../data";

type LastOrder = {
  number: string;
  name: string;
  phone: string;
  total: string;
  subtotal?: string;
  delivery?: string;
  deliveryCost?: string;
  createdAt: string;
};

const STORAGE_KEY = "lilac-last-order";

export default function Confirmation() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        navigate("/");
        return;
      }
      setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  if (!order) return null;

  const followUpText = encodeURIComponent(
    [
      "مرحباً Lilac Gifts 🌸",
      `أرغب بالاستفسار عن طلبي رقم ${order.number}`,
      `الاسم: ${order.name}`,
    ].join("\n"),
  );
  const followUpUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${followUpText}`;

  const confirmCancel = () => {
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "cancel", orderNumber: order.number }),
      }).catch((err) => {
        console.error("[Sheets] cancel failed:", err);
      });
    }

    const cancelLines = [
      "❌ طلب إلغاء",
      `رقم الطلب: ${order.number}`,
      `اسم الزبون: ${order.name}`,
      `رقم الهاتف: ${order.phone}`,
    ];
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(cancelLines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCancelled(true);
    setShowCancel(false);
  };

  if (cancelled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-8 sm:p-10 text-center shadow-sm fade-up">
          <div className="text-7xl mb-4">📨</div>
          <h1 className="text-3xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-3">
            تم إرسال طلب الإلغاء
          </h1>
          <p className="text-[#A87FD1] mb-2">
            تم إرسال طلب إلغاء الطلب رقم
          </p>
          <div dir="ltr" className="text-2xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-6">
            {order.number}
          </div>
          <p className="text-sm text-[#A87FD1] mb-8">
            سيتواصل معكِ فريقنا قريباً لتأكيد الإلغاء.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-8 sm:p-10 text-center shadow-sm fade-up">
        <div className="text-7xl mb-4 float-slow">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-3">
          تم استلام طلبكِ بنجاح! 🎉
        </h1>
        <p className="text-[#A87FD1] mb-2">شكراً لاختياركِ Lilac Gifts 🌸</p>
        <p className="text-[#534AB7] dark:text-[#C8A8E9] mb-8">
          سنتواصل معكِ قريباً على رقم:{" "}
          <span dir="ltr" className="font-bold tracking-wider">{order.phone}</span>
        </p>

        <div className="bg-[#EDE0F7] dark:bg-[#1a1a2e] rounded-2xl p-5 mb-6 border border-[#C8A8E9]/40 dark:border-[#2a2f4a]">
          <div className="text-sm text-[#A87FD1] mb-1">رقم الطلب</div>
          <div
            dir="ltr"
            className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] tracking-wider"
          >
            {order.number}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
          <div className="bg-[#EDE0F7]/50 dark:bg-[#1a1a2e] rounded-xl p-3">
            <div className="text-[#A87FD1] mb-1">الاسم</div>
            <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{order.name}</div>
          </div>
          <div className="bg-[#EDE0F7]/50 dark:bg-[#1a1a2e] rounded-xl p-3">
            <div className="text-[#A87FD1] mb-1">الهاتف</div>
            <div dir="ltr" className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{order.phone}</div>
          </div>
          <div className="bg-[#EDE0F7]/50 dark:bg-[#1a1a2e] rounded-xl p-3">
            <div className="text-[#A87FD1] mb-1">المجموع</div>
            <div className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">{order.total}</div>
          </div>
        </div>

        {order.delivery && (
          <div className="text-sm text-[#A87FD1] mb-6">
            🚚 التوصيل: <span className="text-[#534AB7] dark:text-[#C8A8E9] font-bold">{order.delivery}</span>
            {order.deliveryCost ? <> — {order.deliveryCost}</> : null}
          </div>
        )}

        <div className="bg-gradient-to-bl from-[#EDE0F7] to-white dark:from-[#16213e] dark:to-[#1a1a2e] rounded-2xl p-5 mb-8 border border-[#C8A8E9]/40 dark:border-[#2a2f4a]">
          <div className="text-2xl mb-2">💬</div>
          <p className="text-[#534AB7] dark:text-[#C8A8E9] font-bold text-lg mb-1">
            سيتم التواصل معكِ قريباً
          </p>
          <p className="text-sm text-[#A87FD1]">
            فريقنا سيراجع طلبكِ ويتواصل معكِ عبر واتساب لتأكيد التفاصيل والتوصيل
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={followUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] btn-anim shadow flex items-center justify-center gap-2"
          >
            <span>تابع طلبكِ على واتساب</span>
            <span>💬</span>
          </a>
          <Link
            href="/"
            className="flex-1 text-center bg-white dark:bg-[#16213e] border-2 border-[#C8A8E9] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] py-4 rounded-2xl font-bold text-lg hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
          >
            العودة للمتجر
          </Link>
        </div>

        <button
          onClick={() => setShowCancel(true)}
          className="mt-4 w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 dark:hover:bg-[#2a2f4a] border-2 border-red-200 dark:border-red-900/40 btn-anim"
        >
          إلغاء الطلب ❌
        </button>

        <div className="mt-6 text-xs text-[#A87FD1]">
          احتفظي برقم طلبكِ لمتابعته في أي وقت من صفحة{" "}
          <Link href="/track" className="underline font-bold">
            تتبع الطلب
          </Link>
        </div>
      </div>

      {showCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in"
          onClick={() => setShowCancel(false)}
        >
          <div
            className="bg-white dark:bg-[#16213e] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border-2 border-[#EDE0F7] dark:border-[#2a2f4a] shadow-2xl fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">
              هل أنت متأكد من إلغاء الطلب؟
            </h2>
            <p className="text-sm text-[#A87FD1] mb-6">
              سيتم إرسال طلب الإلغاء لفريقنا عبر واتساب.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 btn-anim"
              >
                نعم، ألغِ الطلب
              </button>
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 bg-white dark:bg-[#1a1a2e] border-2 border-[#C8A8E9] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] py-3 rounded-2xl font-bold hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
