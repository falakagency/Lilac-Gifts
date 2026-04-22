import { Link } from "wouter";
import type { Product } from "../data";
import Stars from "./Stars";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white rounded-3xl border border-[#EDE0F7] overflow-hidden shadow-sm card-anim hover:border-[#C8A8E9] relative"
    >
      {product.bestseller && (
        <span className="absolute top-3 right-3 z-10 bg-gradient-to-bl from-[#534AB7] to-[#A87FD1] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
          الأكثر طلباً 🔥
        </span>
      )}
      <div className="aspect-square bg-[#EDE0F7] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover img-zoom"
          loading="lazy"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-[#2A1F3D] mb-2 line-clamp-1 transition-colors duration-300 group-hover:text-[#534AB7]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5rem]">{product.desc}</p>
        <div className="flex justify-center mb-3">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="inline-block bg-[#EDE0F7] group-hover:bg-[#C8A8E9] group-hover:text-white text-[#534AB7] font-bold px-4 py-2 rounded-full text-sm transition-all duration-300">
          {product.price}
        </div>
      </div>
    </Link>
  );
}
