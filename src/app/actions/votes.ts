"use server";

import { createClient } from "@/utils/supabase/server";

export interface Vote {
  id: string;
  user_id: string;
  restaurant_id: string;
  group_id: string;
  vote_value: boolean;
  created_at: string;
}

export async function storeVote(
  joincode: string,
  restaurantId: string,
  voteValue: boolean,
): Promise<Vote> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // First get the group ID using the joincode
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("joincode", joincode)
    .single();

  if (groupError || !group) {
    console.error("Error fetching group:", groupError);
    throw new Error("Failed to find group");
  }

  const groupId = group.id;

  // Store the vote
  const { data, error } = await supabase
    .from("votes")
    .insert([
      {
        user_id: user?.id,
        restaurant_id: restaurantId,
        group_id: groupId,
        vote_value: voteValue,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error storing vote:", error);
    throw new Error("Failed to store vote");
  }

  return data;
}
