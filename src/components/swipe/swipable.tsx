"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Card } from "./card";

interface RestaurantData {
  name: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  photos: string[];
  rating: number;
  reviews: number;
  id: string;
}

interface SwipeableCardProps {
  restaurant: RestaurantData;
  isTop: boolean;
  index: number;
  zIndex: number;
  onSwipe: (direction: "left" | "right") => void;
  isHovering: boolean;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  spreadDistance: number;
  rotationAngle: number;
  totalCards: number;
  isTransitioning: boolean;
}

export function SwipeableCard({
  restaurant,
  isTop,
  index,
  zIndex,
  onSwipe,
  isHovering,
  setIsHovering,
  spreadDistance,
  rotationAngle,
  totalCards,
  isTransitioning,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [dragRotation, setDragRotation] = useState(0);
  const [swipeIndicator, setSwipeIndicator] = useState<"left" | "right" | null>(
    null,
  );
  const prevIndex = useRef(index);

  function getOpacity() {
    if (isTop) return 1;
    return index === 1 ? 0.7 : 0.5;
  }

  useEffect(() => {
    const unsubscribe = x.onChange((latest) => {
      const newRotation = Math.min(Math.max(latest / 50, -10), 10);
      setDragRotation(newRotation);

      if (latest > 75) {
        setSwipeIndicator("right");
      } else if (latest < -75) {
        setSwipeIndicator("left");
      } else {
        setSwipeIndicator(null);
      }
    });

    return () => unsubscribe();
  }, [x]);

  useEffect(() => {
    if (prevIndex.current !== index) {
      controls.start({
        y: isTop ? 0 : -10,
        scale: isTop ? 1 : 0.95,
        opacity: getOpacity(),
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          delay: 0.05 * index,
        },
      });
    }
    prevIndex.current = index;
  }, [index, isTop, controls]);

  function handleDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const threshold = 100;

    if (info.offset.x > threshold) {
      controls.start({
        x: window.innerWidth + 200,
        transition: { duration: 0.5 },
      });
      setExitDirection("right");
      setTimeout(() => onSwipe("right"), 300);
    } else if (info.offset.x < -threshold) {
      controls.start({
        x: -window.innerWidth - 200,
        transition: { duration: 0.5 },
      });
      setExitDirection("left");
      setTimeout(() => onSwipe("left"), 300);
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
      setSwipeIndicator(null);
    }
  }

  function getCardPosition() {
    const position = {
      scale: isTop ? 1 : 0.95,
      y: isTop ? 0 : -10,
      opacity: getOpacity(),
    };

    if (isHovering && totalCards > 1) {
      let xOffset = 0;
      let rotation = 0;

      if (index === 1) {
        xOffset = -spreadDistance;
        rotation = -rotationAngle;
      } else if (index === 2) {
        xOffset = spreadDistance;
        rotation = rotationAngle;
      }

      return {
        ...position,
        x: xOffset,
        rotate: rotation,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          type: "spring",
          stiffness: 200,
          damping: 25,
        },
      };
    }

    return {
      ...position,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    };
  }

  function getTransition() {
    if (isTransitioning) {
      return {
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.05 * index,
      };
    }

    return {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      type: "spring",
      stiffness: 200,
      damping: 25,
    };
  }

  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-full"
      style={{
        x: isTop ? x : undefined,
        zIndex,
        rotate: isTop && x.get() !== 0 ? dragRotation : undefined,
        opacity: getOpacity(),
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={isTop ? controls : getCardPosition()}
      initial={getCardPosition()}
      exit={{
        x: exitDirection === "left" ? -window.innerWidth : window.innerWidth,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      transition={getTransition()}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className="relative h-full w-full">
        {isTop && swipeIndicator === "left" && (
          <div className="absolute top-10 left-5 z-20 rotate-[-12deg] rounded-lg border-2 border-white bg-red-500 px-4 py-1 text-white">
            <span className="text-xl font-bold">NOPE</span>
          </div>
        )}
        {isTop && swipeIndicator === "right" && (
          <div className="absolute top-10 right-5 z-20 rotate-12 rounded-lg border-2 border-white bg-green-500 px-4 py-1 text-white">
            <span className="text-xl font-bold">LIKE</span>
          </div>
        )}

        <Card
          className={isTop ? "cursor-grab active:cursor-grabbing" : ""}
          name={restaurant.name}
          address={restaurant.address}
          phoneNumber={restaurant.phoneNumber}
          openingHours={restaurant.openingHours}
          photos={restaurant.photos}
          rating={restaurant.rating}
          reviews={restaurant.reviews}
        />
      </div>
    </motion.div>
  );
}
