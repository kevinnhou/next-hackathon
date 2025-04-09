"use client";

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
  stackPosition,
}: {
  restaurant: Restaurant;
  isTop: boolean;
  handleSwipe: (direction: "left" | "right") => void;
  zIndex: number;
  stackPosition: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const swipeRotate = useTransform(x, [-200, 200], [-20, 20]);

  const hasSwipedRef = useRef(false);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  function onDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (hasSwipedRef.current) return;

    if (info.offset.x > 100) {
      hasSwipedRef.current = true;
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      hasSwipedRef.current = true;
      handleSwipe("left");
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      animate(y, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  }

  // Calculate card position values based on stack position
  const cardStyles = {
    x,
    y,
    rotate: isTop ? swipeRotate : stackPosition * -5,
    zIndex,
    transformOrigin: "bottom center",
  };

  // Animation variants for different stack positions
  const variants = {
    current: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 26,
        mass: 0.9,
        duration: 0.4,
      },
    },
    stacked: (position: number) => ({
      scale: 1 - position * 0.05,
      opacity: 1 - position * 0.15,
      rotateY: position * 5,
      translateX: position * 8,
      translateY: position * 15,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 26,
        mass: 0.9,
        duration: 0.4,
      },
    }),
  };

  return (
    <motion.div
      style={cardStyles}
      drag={isTop && !hasSwipedRef.current}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      variants={variants}
      initial="stacked"
      animate={isTop ? "current" : "stacked"}
      custom={stackPosition}
      className="absolute top-0 right-0 left-0 h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="pointer-events-none h-full w-full object-cover"
        />

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
