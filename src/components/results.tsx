"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RestaurantCard } from "./restaurant-card";

import { Button } from "@/components/ui/button";

/**
 * Mock data for restaurants
 * In a real application, this would be fetched from an API
 */
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
  },
];

/**
 * Results component displays a list of restaurant recommendations
 * Users can veto restaurants they don't want to consider
 */
export function Results() {
  // State for restaurants and vetoed restaurants
  const [restaurants] = useState(initialRestaurants);
  const [vetoed, setVetoed] = useState<number[]>([]);
  const router = useRouter();

  // Get top 3 restaurants that haven't been vetoed
  const topThree = restaurants
    .filter((restaurant) => !vetoed.includes(restaurant.id))
    .slice(0, 3);

  /**
   * Handle vetoing a restaurant
   * @param id - The ID of the restaurant to veto
   */
  const handleVeto = (id: number) => {
    setVetoed([...vetoed, id]);
  };

  /**
   * Reset the veto list to show all restaurants again
   */
  const handleReset = () => {
    setVetoed([]);
  };

  /**
   * Navigate back to the previous page
   */
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Back button and reset button */}
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

      {/* Top 3 restaurants */}
      {topThree.length > 0 ? (
        <div className="space-y-4">
          {/* Restaurant cards */}
          {topThree.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              position={index + 1}
              onVeto={handleVeto}
            />
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

      {/* Veto count display */}
      {vetoed.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {vetoed.length} restaurant{vetoed.length !== 1 ? "s" : ""} vetoed
        </div>
      )}
    </div>
  );
}
