import { Star } from "lucide-react";

export function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const isHalfFilled = !isFilled && starValue - 0.5 <= rating;

        return (
          <Star
            key={i}
            className={`h-5 w-5 ${isFilled ? "fill-yellow-400 text-yellow-400" : isHalfFilled ? "fill-yellow-400/50 text-yellow-400" : "text-yellow-400/30"}`}
          />
        );
      })}
      <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
}
