"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RestaurantCard } from "./restaurant-card";

import { Button } from "@/components/ui/button";

// Mock data for restaurants
const initialRestaurants = [
  {
    id: 1,
    name: "The Hungry Dragon",
    cuisine: "Asian Fusion",
    rating: 4.8,
    votes: 127,
    distance: "0.8 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$$",
    isVetoed: false,
  },
  {
    id: 2,
    name: "Bella Italia",
    cuisine: "Italian",
    rating: 4.7,
    votes: 112,
    distance: "1.2 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$$$",
    isVetoed: false,
  },
  {
    id: 3,
    name: "Burger Joint",
    cuisine: "American",
    rating: 4.6,
    votes: 98,
    distance: "0.5 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$$",
    isVetoed: false,
  },
  {
    id: 4,
    name: "Sushi Paradise",
    cuisine: "Japanese",
    rating: 4.5,
    votes: 87,
    distance: "1.5 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$$$",
    isVetoed: false,
  },
  {
    id: 5,
    name: "Taco Tuesday",
    cuisine: "Mexican",
    rating: 4.4,
    votes: 76,
    distance: "0.7 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$",
    isVetoed: false,
  },
  {
    id: 6,
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.3,
    votes: 65,
    distance: "1.8 miles",
    image: "/placeholder.svg?height=200&width=400",
    priceRange: "$$",
    isVetoed: false,
  },
];

export function Results() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [vetoed, setVetoed] = useState<number[]>([]);
  const router = useRouter();

  // Update the handleVeto function to first fade out the card, then update positions
  const handleVeto = (id: number) => {
    // First mark the restaurant as being vetoed (for fade animation)
    const updatedRestaurants = restaurants.map((restaurant) =>
      restaurant.id === id ? { ...restaurant, isVetoed: true } : restaurant,
    );
    setRestaurants(updatedRestaurants);

    // After fade animation completes, update the vetoed list
    setTimeout(() => {
      setVetoed([...vetoed, id]);
    }, 500); // Match this timing with the CSS transition duration
  };

  // Update the topThree calculation to filter out actively vetoing restaurants
  // Get top 3 restaurants that haven't been vetoed
  const topThree = restaurants
    .filter((restaurant) => !vetoed.includes(restaurant.id))
    .slice(0, 3);

  const handleReset = () => {
    setVetoed([]);
    // Reset any animation states
    setRestaurants(initialRestaurants.map((r) => ({ ...r, isVetoed: false })));
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={vetoed.length === 0}
        >
          Reset Results
        </Button>
      </div>

      {topThree.length > 0 ? (
        <div className="space-y-4">
          {topThree.map((restaurant, index) => (
            <div key={restaurant.id} className="mb-4">
              <RestaurantCard
                restaurant={restaurant}
                position={index + 1}
                onVeto={handleVeto}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No more restaurants</h3>
          <p className="mb-4 text-muted-foreground">
            You've vetoed all available restaurants in your area.
          </p>
          <Button onClick={handleReset}>Reset Results</Button>
        </div>
      )}

      {vetoed.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {vetoed.length} restaurant{vetoed.length !== 1 ? "s" : ""} vetoed
        </div>
      )}
    </div>
  );
}
