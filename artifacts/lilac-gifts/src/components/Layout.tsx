import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCart } from "../cart";
import { WHATSAPP_PHONE } from "../data";
import logoUrl from "@assets/image_1776889101826.png";

export default function Layout({ children }: { children: ReactNode }) {
  const { totalCount } = useCart();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [shake, setShake] = useState(false);
  const prevCount = useRef(totalCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalCount > prevCount.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 650);
      prevCount.current = totalCount;
      return () => clearTimeout(t);
    }
    prevCount.current = totalCount;
  }, [totalCount]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#EDE0F7]"
            : "bg-white/60 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group btn-anim">
            <img
              src={logoUrl}
              alt="Lilac Gifts"
              className="w-12 h-12 rounded-full object-cover bg-white shadow-md ring-2 ring-[#EDE0F7] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-[#534AB7]">Lilac Gifts</span>
              <span className="text-xs text-[#A87FD1]">Make your event unforgettable</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className={`hidden sm:inline-block px-4 py-2 rounded-full text-sm font-semibold btn-anim ${
                location === "/"
                  ? "bg-[#EDE0F7] text-[#534AB7]"
                  : "text-[#534AB7] hover:bg-[#EDE0F7]"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              href="/cart"
              className={`relative px-4 py-2 rounded-full bg-[#EDE0F7] text-[#534AB7] font-semibold hover:bg-[#C8A8E9] hover:text-white btn-anim flex items-center gap-2 ${
                shake ? "cart-shake" : ""
              }`}
            >
              <span>🛒</span>
              <span>السلة</span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#534AB7] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow">
                  {totalCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main key={location} className="flex-1 fade-in">
        {children}
      </main>

      <footer className="mt-16 bg-[#EDE0F7] border-t border-[#C8A8E9]/40">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-[#534AB7]">
          <img
            src={logoUrl}
            alt="Lilac Gifts"
            className="w-16 h-16 rounded-full mx-auto mb-3 bg-white shadow ring-2 ring-[#C8A8E9]/40 float-slow"
          />
          <div className="font-bold text-lg">Lilac Gifts — الأردن</div>
          <div className="text-sm mt-2 text-[#A87FD1]">هدايا مخصصة بحب لكل المناسبات</div>
          <div className="text-xs mt-4 text-[#A87FD1]">
            © {new Date().getFullYear()} Lilac Gifts. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP_PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl btn-anim pulse-ring"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
