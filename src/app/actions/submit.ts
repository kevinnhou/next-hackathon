"use server";

import { searchRestaurants } from "@/data/restaurants";
import type { FormValues } from "@/lib/schema";
import { formSchema } from "@/lib/schema";

// This is a simple in-memory store for demonstration purposes
// In a real app, you would use a database or other persistent storage
let storedRestaurants: any[] = [];

export async function submit(formData: FormValues) {
  const result = formSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = result.data.radius * 1609.34;

    // Fetch restaurants from Geoapify
    const restaurants = await searchRestaurants(
      result.data.location,
      radiusInMeters,
      20, // limit
    );

    // Store the restaurants (in a real app, this would be in a database)
    storedRestaurants = restaurants;

    // Log restaurant information to the console
    console.warn("=== RESTAURANT INFORMATION ===");
    console.warn(`Found ${restaurants.length} restaurants near your location`);
    console.warn("Restaurant names:");
    restaurants.forEach((restaurant, index) => {
      console.warn(`${index + 1}. ${restaurant.name}`);
    });
    console.warn("=============================");

    // eslint-disable-next-line no-console
    console.info("Fetched and stored restaurants:", restaurants.length);

    return {
      success: true,
      message: "Group created and restaurants fetched successfully!",
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      success: false,
      message: "Failed to fetch restaurants. Please try again.",
    };
  }
}

// Function to retrieve stored restaurants
export async function getStoredRestaurants() {
  return storedRestaurants;
}
