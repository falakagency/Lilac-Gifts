import { Link } from "wouter";
import type { Product } from "../data";
import Stars from "./Stars";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white dark:bg-[#16213e] rounded-3xl border border-[#EDE0F7] dark:border-[#2a2f4a] overflow-hidden shadow-sm card-anim hover:border-[#C8A8E9] relative"
    >
      {product.bestseller && (
        <div className="bestseller-ribbon" aria-label="الأكثر طلباً">
          <span className="bestseller-ribbon__text">الأكثر طلباً</span>
        </div>
      )}
      <div className="aspect-square bg-[#EDE0F7] dark:bg-[#1a1a2e] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover img-zoom"
          loading="lazy"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-[#2A1F3D] dark:text-[#eee] mb-2 line-clamp-1 transition-colors duration-300 group-hover:text-[#534AB7] dark:group-hover:text-[#C8A8E9]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 min-h-[2.5rem]">{product.desc}</p>
        <div className="flex justify-center mb-3">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="inline-block bg-[#EDE0F7] dark:bg-[#2a2f4a] group-hover:bg-[#C8A8E9] group-hover:text-white text-[#534AB7] dark:text-[#C8A8E9] font-bold px-4 py-2 rounded-full text-sm transition-all duration-300">
          {product.price}
        </div>
      </div>
    </Link>
  );
}
