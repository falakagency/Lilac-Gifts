import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { findProduct, findCategoryByProduct, WHATSAPP_PHONE } from "../data";
import { useCart } from "../cart";

export default function Product() {
  const params = useParams();
  const id = Number(params.id);
  const product = findProduct(id);
  const category = findCategoryByProduct(id);
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);

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

  const whatsappText = encodeURIComponent(
    `مرحباً Lilac Gifts 🌸\nأرغب بطلب:\n• ${product.name}\nالسعر: ${product.price}\nالرابط: ${window.location.href}`,
  );

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
        <div className="bg-[#EDE0F7] rounded-3xl overflow-hidden aspect-square">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#534AB7] mb-3">{product.name}</h1>
          <div className="text-3xl font-bold text-[#A87FD1] mb-6">{product.price}</div>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.desc}</p>

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
              className="w-full bg-[#534AB7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg "
            >
              اشتري الآن
            </button>

            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow  border-2 ${added ? "bg-green-100 text-green-700 border-green-300" : "bg-white text-[#534AB7] border-[#C8A8E9] hover:bg-[#EDE0F7]"}`}
            >
              {added ? "✓ تمت الإضافة للسلة" : "أضف إلى السلة"}
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1da851] btn-anim shadow flex items-center justify-center gap-2 "
            >
              <span>اطلب عبر واتساب</span>
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
