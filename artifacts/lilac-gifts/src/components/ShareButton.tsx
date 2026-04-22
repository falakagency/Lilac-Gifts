import { useState } from "react";

type Props = {
  title: string;
  text?: string;
  url?: string;
};

export default function ShareButton({ title, text, url }: Props) {
  const [toast, setToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const data = { title, text: text || title, url: shareUrl };

    if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
      try {
        await (navigator as Navigator).share!(data);
        return;
      } catch {
        // user cancelled or share failed; fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      // last-resort fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full bg-white text-[#534AB7] border-2 border-[#C8A8E9] py-4 rounded-2xl font-bold text-lg hover:bg-[#EDE0F7] btn-anim flex items-center justify-center gap-2"
      >
        <span>شارك المنتج</span>
        <span>📤</span>
      </button>

      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
          toast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="bg-[#534AB7] text-white px-5 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2">
          <span>تم نسخ الرابط</span>
          <span>✓</span>
        </div>
      </div>
    </>
  );
}
