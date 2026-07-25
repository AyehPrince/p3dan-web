import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import PhotoManager from "@/components/PhotoManager";

export default async function ListingPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirect=/list-property/photos/${id}`);
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, title")
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  if (listing.owner_id !== user.id) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-heading font-bold text-2xl mb-1">Add photos</h1>
        <p className="text-warmgray-600 mb-6">{listing.title}</p>
        <PhotoManager listingId={listing.id} userId={user.id} />
      </main>
    </>
  );
}