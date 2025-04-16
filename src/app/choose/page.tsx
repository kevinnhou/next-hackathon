"use client";

import { useEffect, useState } from "react";

import { getStoredRestaurants } from "@/app/actions/submit";
import type { Restaurant } from "@/data/restaurants";
import { SwipeCards } from "~/swipe/stacked";

export default function Swipe() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await getStoredRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SwipeCards restaurants={restaurants} />
    </div>
  );
}
