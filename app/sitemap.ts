import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://p3dan.vercel.app";
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, created_at")
    .eq("status", "active");

  const listingEntries: MetadataRoute.Sitemap = (listings || []).map((l) => ({
    url: `${siteUrl}/listings/${l.id}`,
    lastModified: new Date(l.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ...listingEntries,
  ];
}