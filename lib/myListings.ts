import { createClient } from "@/lib/supabase/server";

export type MyListing = {
  id: string;
  title: string;
  price: number;
  status: string;
  rejection_reason: string | null;
  created_at: string;
};

export async function fetchMyListings(userId: string): Promise<MyListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, price, status, rejection_reason, created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my listings:", error.message);
    return [];
  }
  return data || [];
}

export type MyListingEditData = {
  title: string;
  description: string | null;
  price: number;
  deposit_months: number;
  room_type_id: string | null;
  custom_room_type: string | null;
  city_id: string | null;
  area_name: string | null;
  place_id: string | null;
  latitude: number | null;
  longitude: number | null;
  lease_term_years: number;
  payment_structure: string;
};

export async function fetchMyListingForEdit(
  id: string,
  userId: string
): Promise<MyListingEditData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      "title, description, price, deposit_months, room_type_id, custom_room_type, city_id, area_name, place_id, latitude, longitude, lease_term_years, payment_structure, owner_id"
    )
    .eq("id", id)
    .single();

  if (error || !data || data.owner_id !== userId) {
    return null;
  }

  return data;
}