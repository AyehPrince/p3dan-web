import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdminProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") return null;
  return profile;
}

export type AdminListing = {
  id: string;
  title: string;
  price: number;
  status: string;
  verified: boolean;
  created_at: string;
  owner_name: string | null;
  city: string | null;
  area_name: string | null;
};

export async function fetchListingsByStatus(status: string): Promise<AdminListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, title, price, status, verified, created_at, area_name,
      profiles ( full_name ),
      cities ( name )
    `
    )
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin listings:", error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    price: row.price,
    status: row.status,
    verified: row.verified,
    created_at: row.created_at,
    owner_name: row.profiles?.full_name ?? null,
    city: row.cities?.name ?? null,
    area_name: row.area_name,
  }));
}

export type AdminReport = {
  id: string;
  target_type: string;
  target_listing_id: string | null;
  target_user_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  reporter_name: string | null;
  listing_title: string | null;
};

export async function fetchOpenReports(): Promise<AdminReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id, target_type, target_listing_id, target_user_id, reason, description, status, created_at,
      profiles!reports_reporter_id_fkey ( full_name ),
      listings ( title )
    `
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    target_type: row.target_type,
    target_listing_id: row.target_listing_id,
    target_user_id: row.target_user_id,
    reason: row.reason,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    reporter_name: row.profiles?.full_name ?? null,
    listing_title: row.listings?.title ?? null,
  }));
}

export async function fetchDashboardCounts() {
  const supabase = await createClient();
  const [pending, active, reports, users] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return {
    pendingListings: pending.count ?? 0,
    activeListings: active.count ?? 0,
    openReports: reports.count ?? 0,
    totalUsers: users.count ?? 0,
  };
}

export type AdminListingDetail = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  status: string;
  verified: boolean;
  lease_term_years: number;
  deposit_months: number;
  payment_structure: string;
  room_type_name: string;
  area_name: string;
  city: string;
  owner_name: string | null;
  owner_phone: string | null;
  images: string[];
};

export async function fetchAdminListingDetail(id: string): Promise<AdminListingDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, title, description, price, status, verified, lease_term_years, deposit_months,
      payment_structure, custom_room_type, area_name,
      room_types ( name ),
      cities ( name ),
      profiles ( full_name, phone ),
      listing_images ( url, position )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching admin listing detail:", error?.message);
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
    status: row.status,
    verified: row.verified,
    lease_term_years: row.lease_term_years,
    deposit_months: row.deposit_months,
    payment_structure: row.payment_structure,
    room_type_name: row.custom_room_type || row.room_types?.name || "Room",
    area_name: row.area_name || "",
    city: row.cities?.name || "",
    owner_name: row.profiles?.full_name ?? null,
    owner_phone: row.profiles?.phone ?? null,
    images,
  };
}

export type AdminUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  is_trusted: boolean;
  is_suspended: boolean;
  suspended_reason: string | null;
  created_at: string;
  listing_count: number;
};

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id, full_name, phone, role, is_trusted, is_suspended, suspended_reason, created_at,
      listings ( id )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    role: row.role,
    is_trusted: row.is_trusted,
    is_suspended: row.is_suspended,
    suspended_reason: row.suspended_reason,
    created_at: row.created_at,
    listing_count: (row.listings || []).length,
  }));
}

export type DashboardCharts = {
  trend: { date: string; count: number }[];
  byCity: { city: string; count: number }[];
  byStatus: { status: string; count: number }[];
};

export async function fetchDashboardCharts(): Promise<DashboardCharts> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("created_at, status, cities ( name )");

  if (error || !data) {
    console.error("Error fetching dashboard charts:", error?.message);
    return { trend: [], byCity: [], byStatus: [] };
  }

  const trend: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    trend.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const trendMap = new Map(trend.map((d) => [d.date, d]));
  data.forEach((row: any) => {
    const key = (row.created_at as string).slice(0, 10);
    const entry = trendMap.get(key);
    if (entry) entry.count += 1;
  });

  const cityMap = new Map<string, number>();
  data.forEach((row: any) => {
    const name = row.cities?.name || "Unknown";
    cityMap.set(name, (cityMap.get(name) || 0) + 1);
  });
  const byCity = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const statusOrder = ["pending", "active", "rejected", "rented"];
  const statusMap = new Map<string, number>();
  data.forEach((row: any) => {
    statusMap.set(row.status, (statusMap.get(row.status) || 0) + 1);
  });
  const byStatus = statusOrder
    .filter((s) => statusMap.has(s))
    .map((status) => ({ status, count: statusMap.get(status)! }));

  return { trend, byCity, byStatus };
}

export async function fetchReportsByStatus(status: string): Promise<AdminReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id, target_type, target_listing_id, target_user_id, reason, description, status, created_at,
      profiles!reports_reporter_id_fkey ( full_name ),
      listings ( title )
    `
    )
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    target_type: row.target_type,
    target_listing_id: row.target_listing_id,
    target_user_id: row.target_user_id,
    reason: row.reason,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    reporter_name: row.profiles?.full_name ?? null,
    listing_title: row.listings?.title ?? null,
  }));
}