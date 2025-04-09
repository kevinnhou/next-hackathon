"use client";

import { useState, useRef } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwipeCard } from "@/components/swipe/card";
import { ExitingCard } from "@/components/swipe/exit-card";
export default function TinderSwipe() {
  const restaurants = [
    {
      id: 1,
      name: "Zeus Street Greek Turramurra",
      cuisine: "Greek",
      rating: 4.2,
      cost: "$25-35",
      description:
        "Authentic Greek street food with a modern twist, located in Turramurra.",
      image: "/placeholder.svg?height=500&width=400",
    },
    {
      id: 2,
      name: "Bella Brutta Pizzeria",
      cuisine: "Italian",
      rating: 4.7,
      cost: "$30-50",
      description:
        "Neapolitan-style pizzas with a focus on fresh, high-quality ingredients in Newtown.",
      image: "/placeholder.svg?height=500&width=400",
    },
    {
      id: 3,
      name: "Mr. Wong",
      cuisine: "Chinese",
      rating: 4.6,
      cost: "$80-120",
      description:
        "Upscale Cantonese cuisine in a stylish, subterranean setting in the CBD.",
      image: "/placeholder.svg?height=500&width=400",
    },
    {
      id: 4,
      name: "Mary's",
      cuisine: "Burgers",
      rating: 4.4,
      cost: "$20-30",
      description:
        "No-frills burger joint with a cult following, known for their juicy patties and rock 'n' roll vibe in various locations.",
      image: "/placeholder.svg?height=500&width=400",
    },
    {
      id: 5,
      name: "Yellow",
      cuisine: "Modern Australian (Vegetarian/Vegan)",
      rating: 4.3,
      cost: "$70-100",
      description:
        "Award-winning vegetarian and vegan fine dining experience in Potts Point.",
      image: "/placeholder.svg?height=500&width=400",
    },
    {
      id: 6,
      name: "Gelato Messina Darlinghurst",
      cuisine: "Gelato",
      rating: 4.8,
      cost: "$15-25",
      description:
        "Famous for its creative and ever-changing selection of artisanal gelato flavors in Darlinghurst.",
      image: "/placeholder.svg?height=500&width=400",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [disliked, setDisliked] = useState<number[]>([]);
  const [exitingCards, setExitingCards] = useState<
    { id: number; direction: "left" | "right" }[]
  >([]);

  // Use a ref to track if a swipe is in progress to prevent double swipes
  const isSwipingRef = useRef(false);

  const handleSwipe = (direction: "left" | "right") => {
    // Prevent multiple swipes at the same time
    if (isSwipingRef.current) return;
    isSwipingRef.current = true;

    const currentRestaurant = restaurants[currentIndex];

    // Update liked/disliked arrays
    if (direction === "right") {
      setLiked([...liked, currentRestaurant.id]);
    } else {
      setDisliked([...disliked, currentRestaurant.id]);
    }

    // Check if this card is already exiting
    const isAlreadyExiting = exitingCards.some(
      (card) => card.id === currentRestaurant.id,
    );

    if (!isAlreadyExiting) {
      // Add the current card to exiting cards
      setExitingCards((prev) => [
        ...prev,
        { id: currentRestaurant.id, direction },
      ]);
    }

    // Immediately update to next card
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }

    // Reset the swiping flag after a short delay
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 100);
  };

  // Remove card from exiting cards after animation completes
  const handleExitComplete = (id: number) => {
    setExitingCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-800 p-4">
      <div className="mx-auto w-full max-w-md">
        <div className="relative h-[120vh] max-h-[600px] w-full">
          {/* Render exiting cards */}
          {exitingCards.map((exitingCard) => {
            const restaurant = restaurants.find((p) => p.id === exitingCard.id);
            if (!restaurant) return null;

            return (
              <ExitingCard
                key={`exiting-${restaurant.id}-${exitingCard.direction}`}
                restaurant={restaurant}
                direction={exitingCard.direction}
                onExitComplete={() => handleExitComplete(restaurant.id)}
                zIndex={100 + exitingCard.id} // High z-index to stay above new cards initially
              />
            );
          })}

          {/* Render active cards */}
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

        <div className="mt-6 flex justify-center gap-8">
          <Button
            onClick={() => !isSwipingRef.current && handleSwipe("left")}
            size="lg"
            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-neutral-600 transition-all hover:bg-red-900"
          >
            <X className="h-12 w-12 text-red-500" strokeWidth={3} />
          </Button>

          <Button
            onClick={() => !isSwipingRef.current && handleSwipe("right")}
            size="lg"
            className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-neutral-600 transition-all hover:bg-green-900"
          >
            <Heart className="text-green-500" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
}
