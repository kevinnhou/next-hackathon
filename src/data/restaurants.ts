// Define the restaurant type
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

// Function to fetch restaurants from Geoapify API
export async function searchRestaurants(
  location?: { lat: number; lng: number },
  radius: number = 5000, // Default radius in meters (5km)
  limit: number = 20,
): Promise<Restaurant[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    console.warn(
      "Geoapify API key available:",
      apiKey ? `${apiKey.substring(0, 4)}...` : "No API key found",
    );

    if (!apiKey) {
      console.error("Geoapify API key is not set");
      return getFallbackRestaurants();
    }

    // If no location is provided, use a default location (New York City)
    const searchLocation = location || { lat: 40.7128, lng: -74.006 };

    // Construct the API URL
    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${searchLocation.lng},${searchLocation.lat},${radius}&limit=${limit}&apiKey=${apiKey}`;
    console.warn("Fetching restaurants from:", url);

    // Make the API request
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return getFallbackRestaurants();
    }

    const data = await response.json();
    console.warn(
      `Successfully fetched ${data.features?.length || 0} restaurants`,
    );

    // Process the results
    const restaurants = data.features.map((feature: any) => {
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

      // Log each restaurant as it's processed
      console.warn(`Restaurant: ${restaurant.name}`);
      console.warn(`  Address: ${restaurant.address}`);
      console.warn(
        `  Rating: ${restaurant.rating} (${restaurant.reviews} reviews)`,
      );
      console.warn(
        `  Location: ${restaurant.location?.lat}, ${restaurant.location?.lng}`,
      );
      console.warn("  ---");

      return restaurant;
    });

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return getFallbackRestaurants();
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

// Fallback restaurants in case the API call fails
function getFallbackRestaurants(): Restaurant[] {
  return [
    {
      id: "1",
      name: "Pasta Paradise",
      address: "123 Main St, Cityville",
      phoneNumber: "(555) 123-4567",
      openingHours: "Mon-Sat: 11AM-10PM",
      photos: ["/sample.webp"],
      rating: 4.7,
      reviews: 243,
    },
    {
      id: "2",
      name: "Burger Bistro",
      address: "456 Oak Ave, Townsburg",
      phoneNumber: "(555) 987-6543",
      openingHours: "Daily: 10AM-11PM",
      photos: ["/sample.webp"],
      rating: 4.3,
      reviews: 187,
    },
    {
      id: "3",
      name: "Sushi Sensation",
      address: "789 Pine Rd, Villageton",
      phoneNumber: "(555) 456-7890",
      openingHours: "Tue-Sun: 12PM-9PM",
      photos: ["/sample.webp"],
      rating: 4.9,
      reviews: 312,
    },
    {
      id: "4",
      name: "Taco Temple",
      address: "101 Elm St, Hamletville",
      phoneNumber: "(555) 234-5678",
      openingHours: "Mon-Sun: 11AM-9PM",
      photos: ["/sample.webp"],
      rating: 4.5,
      reviews: 178,
    },
    {
      id: "5",
      name: "Pizza Palace",
      address: "202 Maple Ave, Boroughton",
      phoneNumber: "(555) 345-6789",
      openingHours: "Tue-Sun: 12PM-11PM",
      photos: ["/sample.webp"],
      rating: 4.6,
      reviews: 256,
    },
    {
      id: "6",
      name: "Dim Sum Delight",
      address: "303 Cedar Rd, Districtville",
      phoneNumber: "(555) 456-7890",
      openingHours: "Wed-Mon: 10AM-8PM",
      photos: ["/sample.webp"],
      rating: 4.8,
      reviews: 201,
    },
  ];
}

// For backward compatibility, export the fallback restaurants as a static array
export const restaurants = getFallbackRestaurants();
