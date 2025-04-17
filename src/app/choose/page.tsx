"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Restaurant } from "@/data/restaurants";
import { SwipeCards } from "~/swipe/stacked";
import { createClient } from "@/utils/supabase/client";

// Define the type for the restaurant data from the database
interface DbRestaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
}

async function getStoredRestaurants(joincode: string) {
  // Get restaurants from database based on the current group
  const supabase = createClient();

  // First get the group ID using the joincode
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("joincode", joincode)
    .single();

  if (groupError || !group) {
    console.error("Error fetching group:", groupError);
    return [];
  }

  const groupId = group.id;

  // Then get the restaurant IDs for this group
  const { data: groupRestaurants, error: groupRestaurantsError } =
    await supabase
      .from("group_restaurants")
      .select("restaurant_id")
      .eq("group_id", groupId);

  if (groupRestaurantsError) {
    console.error("Error fetching group restaurants:", groupRestaurantsError);
    return [];
  }

  if (!groupRestaurants || groupRestaurants.length === 0) {
    return [];
  }

  // Extract restaurant IDs
  const restaurantIds = groupRestaurants.map((gr) => gr.restaurant_id);

  // Then get the restaurant details
  const { data: restaurants, error: restaurantsError } = await supabase
    .from("restaurants")
    .select("*")
    .in("id", restaurantIds);

  if (restaurantsError) {
    console.error("Error fetching restaurants:", restaurantsError);
    return [];
  }

  // Transform the data to match the Restaurant type
  return (restaurants as DbRestaurant[]).map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    address: restaurant.address || "Address not available",
    phoneNumber: "Not available", // Add these fields if available in your database
    openingHours: "Not available",
    photos: [],
    rating: restaurant.rating || 0,
    reviews: 0,
    location: {
      lat: restaurant.latitude || 0,
      lng: restaurant.longitude || 0,
    },
  }));
}

export default function Swipe() {
  const searchParams = useSearchParams();
  const joincode = searchParams.get("code");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRestaurants() {
      if (!joincode) {
        setError("No group code provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getStoredRestaurants(joincode);
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, [joincode]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <p className="mt-4">
          Please make sure you're accessing this page with a valid group code.
        </p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>No restaurants found for this group.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SwipeCards restaurants={restaurants} />
    </div>
  );
}
