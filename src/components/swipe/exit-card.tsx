"use client";

import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";

import { Rating } from "@/components/swipe/rating";
import type { Restaurant } from "@/types/restaurant";

export function ExitingCard({
  restaurant,
  direction,
  onExitComplete,
  zIndex,
}: {
  restaurant: Restaurant;
  direction: "left" | "right";
  onExitComplete: () => void;
  zIndex: number;
}) {
  const finalXOffset =
    direction === "right" ? window.innerWidth + 200 : -window.innerWidth - 200;
  const rotation = direction === "right" ? 30 : -30;

  const variants = {
    exit: {
      x: finalXOffset,
      y: 100,
      rotate: rotation,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.32, 0.72, 0.29, 0.95],
      },
    },
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate="exit"
      variants={variants}
      onAnimationComplete={() => onExitComplete()}
      style={{ zIndex }}
      className="pointer-events-none absolute top-0 right-0 left-0 h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />

        {direction === "right" && (
          <div className="absolute top-10 right-10 rotate-12 transform rounded-full">
            <Heart
              className="text-2xl font-bold text-green-500"
              size={60}
              strokeWidth={3}
            />
          </div>
        )}

        {direction === "left" && (
          <div className="absolute top-10 left-10 -rotate-12 transform rounded-full">
            <X
              className="text-2xl font-bold text-red-500"
              size={60}
              strokeWidth={3}
            />
          </div>
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
