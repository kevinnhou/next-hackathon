"use client";

import { useEffect, useState } from "react";

// import { getStoredRestaurants } from "@/app/actions/submit"; CHANGE TO GET RESTAURANTS FROM DATABASE BASED OFF CURRENT GROUP!
import type { Restaurant } from "@/data/restaurants";
import { SwipeCards } from "~/swipe/stacked";

async function getStoredRestaurants() {
  // Temporary return mock data that matches the Restaurant type - TODO: Get restaurants from database based off current group
  return [
    {
      id: "1",
      name: "Temporary Restaurant",
      address: "123 Main St",
      phoneNumber: "555-1234",
      openingHours: "9AM-5PM",
      photos: [],
      rating: 4.5,
      reviews: 100,
      location: { lat: 0, lng: 0 },
    },
  ];
}

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
