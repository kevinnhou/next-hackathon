"use server";

import { redirect } from "next/navigation";

import { searchRestaurants } from "@/data/restaurants";
import checkUser from "@/hooks/check-user";
import type { FormValues } from "@/lib/schema";
import { formSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { generateJoincode } from "@/utils/generate-joincode";

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
    // -------------------------------------------- Start of group creation -------------------------------------------- //

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
    const joincode = generateJoincode(6); // Generate a 6-character joincode

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
        joincode: joincode, // Add the joincode
      })
      .select()
      .single();

    console.log(
      "Group creation result:",
      groupError ? "Error" : "Success",
      groupError ? groupError.message : "",
      group ? `Group ID: ${group.id}, Joincode: ${joincode}` : "",
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

    // -------------------------------------------- End of group creation -------------------------------------------- //

    // -------------------------------------------- Start of restaurant logic ---------------------------------------- //

    // Fetch restaurants from Geoapify
    console.log("Fetching restaurants from Geoapify");
    const restaurants = await searchRestaurants(
      result.data.location,
      radiusInMeters,
      20, // limit
    );
    console.log(`Fetched ${restaurants.length} restaurants`);

    // Getting existing restaurants from the database
    const geoapifyIds = restaurants.map((r) => r.id); // r.id is from Geoapify
    console.log("Checking if some restaurants already exist in the database");
    const { data: existingRestaurants, error: existingRestaurantsError } =
      await supabase
        .from("restaurants")
        .select("id, external_id")
        .in("external_id", geoapifyIds);

    if (existingRestaurantsError) {
      console.error(
        "Error fetching existing restaurants:",
        existingRestaurantsError.message,
      );
      return { error: existingRestaurantsError.message };
    }
    //Create a Set of already existing external_ids
    const existingIds = new Set(existingRestaurants.map((r) => r.external_id));

    // Filter out existing restaurants
    const newRestaurants = restaurants.filter((r) => !existingIds.has(r.id));

    console.log(`Found ${newRestaurants.length} new restaurants to insert`);

    // Format the new restaurants for database
    const formattedNewRestaurants = newRestaurants.map((restaurant) => ({
      external_id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.location?.lat,
      longitude: restaurant.location?.lng,
      rating: restaurant.rating,
    }));

    // Insert the new restaurants into the database
    let insertedRestaurants = [];
    if (formattedNewRestaurants.length > 0) {
      console.log("Inserting new restaurants into the database");
      const { data, error: insertError } = await supabase
        .from("restaurants")
        .upsert(formattedNewRestaurants, { onConflict: "external_id" })
        .select();

      if (insertError) {
        console.error("Error inserting new restaurants:", insertError.message);
        return { error: insertError.message };
      }

      insertedRestaurants = data;
      console.log(
        `Successfully inserted ${insertedRestaurants.length} new restaurants`,
      );
    } else {
      console.log("No new restaurants to insert");
    }

    // Now, link **both** existing and new restaurants to the group
    console.log("Linking existing and new restaurants to the group");
    const restaurantsToLink = [
      ...existingRestaurants.map((restaurant) => ({
        group_id: group.id,
        restaurant_id: restaurant.id, // Existing restaurants
      })),
      ...insertedRestaurants.map((restaurant) => ({
        group_id: group.id,
        restaurant_id: restaurant.id, // New restaurants
      })),
    ];

    // Insert the link entries into the group_restaurants table
    const { error: linkError } = await supabase
      .from("group_restaurants")
      .insert(restaurantsToLink);

    if (linkError) {
      console.error("Error linking restaurants to group:", linkError.message);
      return { error: linkError.message };
    }

    console.log(
      `Successfully linked ${restaurantsToLink.length} restaurants to the group.`,
    );

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
      joincode: joincode,
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      success: false,
      message: "Failed to fetch restaurants. Please try again.",
    };
  }
}
