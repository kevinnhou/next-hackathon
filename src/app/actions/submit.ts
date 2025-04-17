"use server";

import { redirect } from "next/navigation";

import { searchRestaurants } from "@/data/restaurants";
import checkUser from "@/hooks/check-user";
import type { FormValues } from "@/lib/schema";
import { formSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";

export async function submit(formData: FormValues) {
  console.log("Starting submit function with formData:", formData);

  const result = formSchema.safeParse(formData);
  console.log(
    "Form validation result:",
    result.success ? "Success" : "Failed",
    result.success ? "" : result.error,
  );

  const supabase = await createClient();
  console.log("Supabase client created");

  const isLoggedIn = await checkUser();
  console.log("User logged in:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("User not logged in, redirecting to login page");
    redirect("/login");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(
    "User data fetched:",
    user ? "Success" : "Failed",
    userError ? userError.message : "",
  );

  if (userError || !user) {
    console.error("Error fetching user:", userError?.message || userError);
    return {
      success: false,
      message: "Failed to fetch user. Please try again.",
    };
  }

  if (!result.success) {
    console.log("Form validation failed, returning errors");
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    console.log("Starting group creation process");

    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Math.ceil(result.data.radius * 1609.34);
    console.log("Radius in meters:", radiusInMeters);

    // Check if the group already exists
    console.log("Checking if group already exists");

    const { data: existingGroup, error: existingGroupError } = await supabase
      .from("groups")
      .select("id")
      .eq("name", result.data.groupName)
      .eq("created_by", user.id)
      .maybeSingle();

    console.log(
      "Existing group check result:",
      existingGroupError ? "Error" : "Success",
      existingGroupError ? existingGroupError.message : "",
    );

    if (existingGroup) {
      console.warn("Group already exists for this user!");
      return {
        success: false,
        message: "You already have a group with this name.",
      };
    }

    console.log("Creating new group");
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name: result.data.groupName,
        budget: result.data.budget,
        radius: radiusInMeters,
        latitude: result.data.location.lat,
        longitude: result.data.location.lng,
        created_by: user.id,
        is_active: true, // optional but nice
      })
      .select()
      .single();

    console.log(
      "Group creation result:",
      groupError ? "Error" : "Success",
      groupError ? groupError.message : "",
      group ? `Group ID: ${group.id}` : "",
    );

    if (groupError) {
      console.error("Error creating group:", groupError.message);
      return {
        success: false,
        message: "Failed to create group. Please try again.",
      };
    }

    // Add user as group host
    console.log("Adding user as group host");
    const { error: hostError } = await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: user.id,
      is_host: true,
      joined_at: new Date().toISOString(),
    });

    console.log(
      "Host addition result:",
      hostError ? "Error" : "Success",
      hostError ? hostError.message : "",
    );

    if (hostError) {
      console.error("Error adding host to group_members:", hostError.message);
      return { error: hostError.message };
    }

    // Fetch restaurants from Geoapify
    console.log("Fetching restaurants from Geoapify");
    const restaurants = await searchRestaurants(
      result.data.location,
      radiusInMeters,
      20, // limit
    );
    console.log(`Fetched ${restaurants.length} restaurants`);

    console.log("Formatting restaurants for database");
    const formattedRestaurants = restaurants.map((restaurant) => ({
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.location?.lat,
      longitude: restaurant.location?.lng,
      rating: restaurant.rating,
    }));

    // First, insert unique restaurants
    console.log("Inserting restaurants into database");
    const { data: insertedRestaurants, error: insertError } = await supabase
      .from("restaurants")
      .upsert(formattedRestaurants, { onConflict: "id" }) // Assuming each restaurant has a unique ID
      .select();

    console.log(
      "Restaurant insertion result:",
      insertError ? "Error" : "Success",
      insertError ? insertError.message : "",
      insertedRestaurants
        ? `Inserted ${insertedRestaurants.length} restaurants`
        : "",
    );

    if (insertError) {
      console.error("Error inserting restaurants:", insertError.message);
      return { error: insertError.message };
    }

    // Then, link restaurants to group via group_restaurants
    console.log("Linking restaurants to group");
    const { error: linkError } = await supabase
      .from("group_restaurants")
      .insert(
        insertedRestaurants.map((restaurant) => ({
          group_id: group.id,
          restaurant_id: restaurant.id,
          votes: 0,
        })),
      );

    console.log(
      "Restaurant linking result:",
      linkError ? "Error" : "Success",
      linkError ? linkError.message : "",
    );

    if (linkError) {
      console.error("Error linking restaurants:", linkError.message);
      return { error: linkError.message };
    }
    // Log restaurant information to the console (debugging)
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
