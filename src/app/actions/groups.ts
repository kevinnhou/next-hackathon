// src/actions/groups.ts
"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUserGroups() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    // First, get all groups the user is a member of
    const { data: groupMemberships, error: membershipError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);

    if (membershipError) {
      console.error(
        "Error fetching group memberships:",
        membershipError.message || membershipError,
      );
      return [];
    }

    if (!groupMemberships || groupMemberships.length === 0) {
      return [];
    }

    // Extract group IDs
    const groupIds = groupMemberships.map((membership) => membership.group_id);

    // Then, get the details for each group
    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select(
        `
        id,
        name,
        budget,
        radius,
        latitude,
        longitude,
        address,
        created_at,
        is_active
      `,
      )
      .in("id", groupIds);

    if (groupsError) {
      console.error(
        "Error fetching groups:",
        groupsError.message || groupsError,
      );
      return [];
    }

    // Get member counts for each group
    const memberCounts: Record<string, number> = {};

    const { data: allMembers } = await supabase
      .from("group_members")
      .select("group_id")
      .in("group_id", groupIds);

    if (allMembers) {
      allMembers.forEach((item) => {
        memberCounts[item.group_id] = (memberCounts[item.group_id] || 0) + 1;
      });
    }

    // Map the data to the expected format
    return (
      groups?.map((group) => ({
        id: group.id,
        name: group.name,
        budget: group.budget,
        radius: group.radius,
        location:
          group.latitude && group.longitude
            ? { lat: group.latitude, lng: group.longitude }
            : null,
        address: group.address,
        users: memberCounts[group.id] || 0,
        active: group.is_active,
        createdAt: new Date(group.created_at),
      })) || []
    );
  } catch (err) {
    console.error("Unexpected error in getUserGroups:", err);
    return [];
  }
}
