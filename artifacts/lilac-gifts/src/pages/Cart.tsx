import { Link } from "wouter";
import { useCart } from "../cart";

export default function Cart() {
  const { items, updateQty, removeItem, totalPriceText, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold text-[#534AB7] mb-2">سلتك فارغة</h2>
        <p className="text-[#A87FD1] mb-6">لم تقومي بإضافة أي منتجات بعد</p>
        <Link href="/" className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim">
            تصفحي المنتجات
          </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#534AB7] mb-8">سلة التسوق</h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, qty }) => (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row gap-4 bg-white border border-[#EDE0F7] rounded-2xl p-4 hover:border-[#C8A8E9] btn-anim"
          >
            <Link href={`/product/${product.id}`} className="block w-full sm:w-28 h-28 bg-[#EDE0F7] rounded-xl overflow-hidden flex-shrink-0">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
              </Link>

            <div className="flex-1 flex flex-col">
              <Link href={`/product/${product.id}`} className="font-bold text-[#2A1F3D] hover:text-[#534AB7] mb-1">{product.name}</Link>
              <div className="text-[#A87FD1] font-bold mb-3">{product.price}</div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-[#EDE0F7] rounded-full p-1">
                  <button
                    onClick={() => updateQty(product.id, qty - 1)}
                    className="w-8 h-8 rounded-full bg-white text-[#534AB7] font-bold hover:bg-[#C8A8E9] hover:text-white btn-anim"
                    aria-label="إنقاص"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-[#534AB7]">{qty}</span>
                  <button
                    onClick={() => updateQty(product.id, qty + 1)}
                    className="w-8 h-8 rounded-full bg-white text-[#534AB7] font-bold hover:bg-[#C8A8E9] hover:text-white btn-anim"
                    aria-label="زيادة"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#EDE0F7] rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#534AB7] font-semibold">المجموع</span>
          <span className="text-2xl font-extrabold text-[#534AB7]">{totalPriceText}</span>
        </div>
        <p className="text-sm text-[#A87FD1]">رسوم التوصيل تُحسب عند التأكيد عبر واتساب</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/checkout" className="flex-1 text-center bg-[#534AB7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg">
            إتمام الطلب
          </Link>
        <Link href="/" className="flex-1 text-center bg-white border-2 border-[#C8A8E9] text-[#534AB7] py-4 rounded-2xl font-bold text-lg hover:bg-[#EDE0F7] btn-anim">
            متابعة التسوق
          </Link>
        <button
          onClick={clear}
          className="sm:w-auto px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 btn-anim"
        >
          إفراغ السلة
        </button>
      </div>
    </div>
  );
}
