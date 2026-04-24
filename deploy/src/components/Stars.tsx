type Props = {
  rating: number;
  reviews: number;
  size?: "sm" | "md";
  className?: string;
};

export default function Stars({ rating, reviews, size = "sm", className = "" }: Props) {
  const starSize = size === "md" ? "text-lg" : "text-sm";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fillPct = Math.max(0, Math.min(1, rating - (i - 1))) * 100;
    return (
      <span key={i} className={`relative inline-block ${starSize} leading-none`}>
        <span className="text-gray-300">★</span>
        <span
          className="absolute inset-0 overflow-hidden text-[#F5B301]"
          style={{ width: `${fillPct}%` }}
        >
          ★
        </span>
      </span>
    );
  });

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span dir="ltr" className="inline-flex" aria-label={`${rating} من 5`}>
        {stars}
      </span>
      <span className={`${textSize} text-[#A87FD1] font-semibold`}>
        {rating.toFixed(1)} ({reviews} تقييم)
      </span>
    </div>
  );
}
