import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { WHATSAPP_PHONE } from "../data";

type LastOrder = {
  number: string;
  name: string;
  phone: string;
  total: string;
  createdAt: string;
};

const STORAGE_KEY = "lilac-last-order";

export default function Confirmation() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<LastOrder | null>(null);

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
      `مرحباً Lilac Gifts 🌸`,
      `أرغب بالاستفسار عن طلبي رقم ${order.number}`,
      `الاسم: ${order.name}`,
    ].join("\n"),
  );
  const followUpUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${followUpText}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-8 sm:p-10 text-center shadow-sm fade-up">
        <div className="text-7xl mb-4 float-slow">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-3">
          تم استلام طلبك بنجاح
        </h1>
        <p className="text-[#A87FD1] mb-8">شكراً لاختياركِ Lilac Gifts 🌸</p>

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
            <span>متابعة الطلب عبر واتساب</span>
            <span>💬</span>
          </a>
          <Link
            href="/"
            className="flex-1 text-center bg-white dark:bg-[#16213e] border-2 border-[#C8A8E9] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] py-4 rounded-2xl font-bold text-lg hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
          >
            العودة للرئيسية
          </Link>
        </div>

        <div className="mt-6 text-xs text-[#A87FD1]">
          احتفظي برقم طلبكِ لمتابعته في أي وقت من صفحة{" "}
          <Link href="/track" className="underline font-bold">
            تتبع الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
