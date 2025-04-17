import { createClient } from "@/utils/supabase/server"; // Assuming db is your database client

export async function getTopRestaurants() {
  const supabase = await createClient(); // Ensure client creation is awaited
  // Fetch the top 3 restaurants
  const { data: topRestaurants, error: topError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("vetoed", false)
    .order("votes", { ascending: false })
    .limit(3);

  const topRestaurantIds = topRestaurants?.map((restaurant) => restaurant.id);

  const { data: remainingRestaurants, error: remainingError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("vetoed", false)
    .not("id", "in", topRestaurantIds)
    .order("votes", { ascending: false });

  if (remainingError) {
    throw new Error(remainingError.message);
  }

  if (topError) {
    throw new Error(topError.message);
  }

  return { topRestaurants, remainingRestaurants };
}
