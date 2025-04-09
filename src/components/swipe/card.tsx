import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useRef } from "react";

import { Rating } from "@/components/swipe/rating";
import type { Restaurant } from "@/types/restaurant";

export function SwipeCard({
  restaurant,
  isTop,
  handleSwipe,
  zIndex,
}: {
  restaurant: Restaurant;
  isTop: boolean;
  handleSwipe: (direction: "left" | "right") => void;
  zIndex: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  // Use a ref to track if this card has already been swiped
  const hasSwipedRef = useRef(false);

  // Calculate opacity for the like/dislike indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // Prevent multiple swipes for the same card
    if (hasSwipedRef.current) return;

    if (info.offset.x > 100) {
      // Swiped right
      hasSwipedRef.current = true;
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      // Swiped left
      hasSwipedRef.current = true;
      handleSwipe("left");
    } else {
      // Reset position if not swiped far enough
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      animate(y, 0, { type: "spring", stiffness: 500, damping: 30 });
      animate(rotate, 0, { type: "spring", stiffness: 500, damping: 30 });
      animate(scale, 1, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex,
      }}
      drag={isTop && !hasSwipedRef.current}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      initial={
        isTop ? { scale: 0.95, opacity: 1 } : { scale: 0.9, opacity: 0.7 }
      }
      animate={isTop ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute top-0 right-0 left-0 h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="pointer-events-none h-full w-full object-cover"
        />

        {/* Like indicator */}
        {isTop && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-10 right-10 rotate-12 transform rounded-full"
          >
            <Heart
              className="text-2xl font-bold text-green-500"
              size={60}
              strokeWidth={3}
            />
          </motion.div>
        )}

        {/* Dislike indicator */}
        {isTop && (
          <motion.div
            style={{ opacity: dislikeOpacity }}
            className="absolute top-10 left-10 -rotate-12 transform rounded-full"
          >
            <X
              className="text-2xl font-bold text-red-500"
              size={60}
              strokeWidth={3}
            />
          </motion.div>
        )}

        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h2 className="text-3xl font-bold">{restaurant.name}</h2>
          <p className="text-lg">
            {restaurant.cuisine} - {restaurant.cost}
          </p>
          <Rating rating={restaurant.rating} />
        </div>
      </div>
    </motion.div>
  );
}
