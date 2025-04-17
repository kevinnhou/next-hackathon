/* eslint-disable ts/no-unused-vars */
/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
"use client";

import { useEffect, useState } from "react";

import { SwipeableCard } from "./swipable";

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

export function SwipeCards({
  restaurants,
  spreadDistance = 40,
  rotationAngle = 5,
  onVote,
}: {
  restaurants: RestaurantData[];
  spreadDistance?: number;
  rotationAngle?: number;
  onVote?: (restaurantId: string, voteValue: boolean) => Promise<void>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedCards, setDisplayedCards] = useState<RestaurantData[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setDisplayedCards(restaurants.slice(0, Math.min(3, restaurants.length)));
  }, [restaurants]);

  async function removeCard(direction: "left" | "right") {
    setIsTransitioning(true);

    const currentRestaurant = displayedCards[0];
    if (currentRestaurant && onVote) {
      try {
        await onVote(currentRestaurant.id, direction === "right");
      } catch (error) {
        console.error("Failed to store vote:", error);
      }
    }

    const newDisplayedCards = [...displayedCards];
    newDisplayedCards.shift();

    const nextCardIndex = currentIndex + 3;
    if (nextCardIndex < restaurants.length) {
      newDisplayedCards.push(restaurants[nextCardIndex]);
    }

    setDisplayedCards(newDisplayedCards);
    setCurrentIndex(currentIndex + 1);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[400px] w-[350px]">
        {displayedCards.map((restaurant, index) => (
          <SwipeableCard
            key={`${restaurant.id}-${index}`}
            restaurant={restaurant}
            isTop={index === 0}
            index={index}
            zIndex={displayedCards.length - index}
            onSwipe={removeCard}
            isHovering={isHovering}
            setIsHovering={setIsHovering}
            spreadDistance={spreadDistance}
            rotationAngle={rotationAngle}
            totalCards={displayedCards.length}
            isTransitioning={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
}
