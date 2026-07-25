import { createClient } from "@/lib/supabase/server";

export type PublicListing = {
  id: string;
  title: string;
  price: number;
  room_type_name: string;
  area_name: string;
  city: string;
  lease_term_years: number;
  verified: boolean;
  imageUrl: string | null;
};

export type ListingFilters = {
  q?: string;
  roomTypeId?: string;
  cityId?: string;
};

function escapeForOr(value: string): string {
  // PostgREST's .or() syntax treats commas and parentheses as structural
  // characters. Strip them so user input can't alter the filter's shape,
  // and so ordinary searches containing them don't silently break.
  return value.replace(/[,()]/g, " ").trim();
}

export async function fetchActiveListings(
  filters: ListingFilters = {}
): Promise<PublicListing[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(
      `
      id, title, price, lease_term_years, verified, custom_room_type, area_name,
      room_type_id, city_id,
      room_types ( name ),
      cities ( name ),
      listing_images ( url, position )
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (filters.roomTypeId) {
    query = query.eq("room_type_id", filters.roomTypeId);
  }
  if (filters.cityId) {
    query = query.eq("city_id", filters.cityId);
  }
  if (filters.q && filters.q.trim()) {
    const q = escapeForOr(filters.q.trim());
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,area_name.ilike.%${q}%,custom_room_type.ilike.%${q}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching listings:", error.message);
    return [];
  }

  return (data || []).map((row: any) => {
    const sortedImages = (row.listing_images || []).sort(
      (a: any, b: any) => a.position - b.position
    );
    return {
      id: row.id,
      title: row.title,
      price: row.price,
      lease_term_years: row.lease_term_years,
      verified: row.verified,
      room_type_name: row.custom_room_type || row.room_types?.name || "Room",
      area_name: row.area_name || "",
      city: row.cities?.name || "",
      imageUrl: sortedImages[0]?.url ?? null,
    };
  });
}

export type ListingDetail = PublicListing & {
  description: string | null;
  deposit_months: number;
  payment_structure: string;
  owner_name: string | null;
  owner_phone: string | null;
  owner_is_trusted: boolean;
  images: string[];
};

export async function fetchListingDetail(
  id: string
): Promise<ListingDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, title, description, price, lease_term_years, deposit_months,
      payment_structure, verified, custom_room_type, area_name,
      room_types ( name ),
      cities ( name ),
      profiles ( full_name, phone, is_trusted ),
      listing_images ( url, position )
    `
    )
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    console.error("Error fetching listing detail:", error?.message);
    return null;
  }

  const row: any = data;
  const images = (row.listing_images || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((img: any) => img.url);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    lease_term_years: row.lease_term_years,
    deposit_months: row.deposit_months,
    payment_structure: row.payment_structure,
    verified: row.verified,
    room_type_name: row.custom_room_type || row.room_types?.name || "Room",
    area_name: row.area_name || "",
    city: row.cities?.name || "",
    owner_name: row.profiles?.full_name ?? null,
    owner_phone: row.profiles?.phone ?? null,
    owner_is_trusted: row.profiles?.is_trusted ?? false,
    images,
    imageUrl: images[0] ?? null,
  };
}