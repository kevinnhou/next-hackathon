"use client";

import { useRef, useState } from "react";

import { restaurants } from "@/data/restaurants";
import { SwipeCard } from "~/swipe/card";
import { ExitingCard } from "~/swipe/exit-card";

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [disliked, setDisliked] = useState<number[]>([]);
  const [exitingCards, setExitingCards] = useState<
    { id: number; direction: "left" | "right" }[]
  >([]);

  const isSwipingRef = useRef(false);

  function handleSwipe(direction: "left" | "right") {
    if (isSwipingRef.current) return;
    isSwipingRef.current = true;

    const currentRestaurant = restaurants[currentIndex];

    if (direction === "right") {
      setLiked([...liked, currentRestaurant.id]);
    } else {
      setDisliked([...disliked, currentRestaurant.id]);
    }

    const isAlreadyExiting = exitingCards.some(
      (card) => card.id === currentRestaurant.id,
    );

    if (!isAlreadyExiting) {
      setExitingCards((prev) => [
        ...prev,
        { id: currentRestaurant.id, direction },
      ]);
    }

    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }

    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  }

  function handleExitComplete(id: number) {
    setExitingCards((prev) => prev.filter((card) => card.id !== id));
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-800 p-4">
      <div className="mx-auto w-full max-w-md">
        <div className="relative h-[120vh] max-h-[600px] w-full">
          {exitingCards.map((exitingCard) => {
            const restaurant = restaurants.find((p) => p.id === exitingCard.id);
            if (!restaurant) return null;

            return (
              <ExitingCard
                key={`exiting-${restaurant.id}-${exitingCard.direction}`}
                restaurant={restaurant}
                direction={exitingCard.direction}
                onExitComplete={() => handleExitComplete(restaurant.id)}
                zIndex={100 + exitingCard.id}
              />
            );
          })}

          {restaurants.map(
            (restaurant, index) =>
              index >= currentIndex &&
              index < currentIndex + 3 && (
                <SwipeCard
                  key={`active-${restaurant.id}`}
                  restaurant={restaurant}
                  isTop={index === currentIndex}
                  handleSwipe={handleSwipe}
                  zIndex={restaurants.length - index}
                />
              ),
          )}
        </div>
      </div>
    </div>
  );
}
