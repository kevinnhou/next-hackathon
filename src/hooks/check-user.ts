import { createClient } from "@/utils/supabase/server";

export default async function checkUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return false;
  }
  return true;
}
