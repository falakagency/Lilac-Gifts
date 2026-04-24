import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">🌸</div>
      <h1 className="text-4xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-2">
        الصفحة غير موجودة
      </h1>
      <p className="text-[#A87FD1] mb-6">يبدو أن الصفحة التي تبحثين عنها غير متوفرة</p>
      <Link
        href="/"
        className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A87FD1] btn-anim"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
