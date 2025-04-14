// Define the restaurant type to match the existing interface
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  photos: string[];
  rating: number;
  reviews: number;
  location?: {
    lat: number;
    lng: number;
  };
}

// Function to search for restaurants near a location
export async function searchRestaurants(
  location: { lat: number; lng: number },
  radius: number = 5000, // Default radius in meters (5km)
  limit: number = 20,
): Promise<Restaurant[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      throw new Error("Geoapify API key is not set");
    }

    // Construct the API URL
    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${location.lng},${location.lat},${radius}&limit=${limit}&apiKey=${apiKey}`;

    // Make the API request
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Process the results
    return data.features.map((feature: any) => {
      const { properties } = feature;

      // Format the restaurant data
      const restaurant: Restaurant = {
        id:
          properties.place_id ||
          `restaurant-${Math.random().toString(36).substring(2, 9)}`,
        name: properties.name || "Unknown Restaurant",
        address:
          properties.formatted ||
          properties.address_line2 ||
          "Address not available",
        phoneNumber: properties.phone || "Phone not available",
        openingHours:
          formatOpeningHours(properties.opening_hours) || "Hours not available",
        photos: properties.photo_url
          ? [properties.photo_url]
          : ["/sample.webp"],
        rating: properties.rating || 0,
        reviews: properties.rating_count || 0,
        location: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        },
      };

      return restaurant;
    });
  } catch (error) {
    console.error("Error searching for restaurants:", error);
    throw error;
  }
}

// Function to format opening hours
function formatOpeningHours(hours: any): string {
  if (!hours) return "Hours not available";

  // If hours is a string, return it directly
  if (typeof hours === "string") return hours;

  // If hours is an object with weekday_text, join them
  if (hours.weekday_text && Array.isArray(hours.weekday_text)) {
    return hours.weekday_text.join(", ");
  }

  // If hours is an object with periods, format them
  if (hours.periods && Array.isArray(hours.periods)) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const formattedHours: string[] = [];

    hours.periods.forEach((period: any) => {
      const openDay = days[period.open.day];
      const openTime = formatTime(period.open.time);
      const closeTime = formatTime(period.close.time);

      formattedHours.push(`${openDay}: ${openTime}-${closeTime}`);
    });

    return formattedHours.join(", ");
  }

  return "Hours not available";
}

// Function to format time from HHMM format to HH:MM AM/PM
function formatTime(time: string): string {
  if (!time) return "";

  const hour = Number.parseInt(time.substring(0, 2));
  const minute = time.substring(2, 4);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute} ${period}`;
}

// Function to get the user's current location
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}
