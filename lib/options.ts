import { createClient } from "@/lib/supabase/server";

export type Option = { id: string; name: string };

export async function fetchRoomTypeOptions(): Promise<Option[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("room_types")
    .select("id, name")
    .order("sort_order");
  return data || [];
}

export async function fetchCityOptions(): Promise<Option[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cities")
    .select("id, name")
    .order("sort_order");
  return data || [];
}