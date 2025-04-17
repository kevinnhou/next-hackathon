// src/actions/groups.ts
"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUserGroups() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      group_id,
      groups:groups!inner(
        id,
        name,
        budget,
        radius,
        latitude,
        longitude,
        created_at,
        is_active,
        group_members:group_members!inner(
          id
        )
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching groups:", error);
    return [];
  }

  return (
    data?.map((item: any) => ({
      id: item.groups.id,
      name: item.groups.name,
      budget: item.groups.budget,
      radius: item.groups.radius,
      location: item.groups.location,
      users: item.groups.group_members.length,
      active: item.groups.is_active,
      createdAt: new Date(item.groups.created_at),
    })) || []
  );
}
