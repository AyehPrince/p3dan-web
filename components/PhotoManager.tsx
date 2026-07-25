"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadListingImageWeb } from "@/lib/imageUpload";

const MAX_PHOTOS = 6;

type ListingImage = {
  id: string;
  url: string;
  position: number;
};

export default function PhotoManager({
  listingId,
  userId,
}: {
  listingId: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    const { data } = await supabase
      .from("listing_images")
      .select("id, url, position")
      .eq("listing_id", listingId)
      .order("position");
    setImages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, [listingId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos per listing.`);
      return;
    }

    setError(null);
    setUploading(true);
    const url = await uploadListingImageWeb(file, userId, listingId);

    if (!url) {
      setUploading(false);
      setError("Couldn't upload that photo. Please try again.");
      return;
    }

    const nextPosition =
      images.length > 0 ? Math.max(...images.map((i) => i.position)) + 1 : 0;
    const { error: insertError } = await supabase
      .from("listing_images")
      .insert({ listing_id: listingId, url, position: nextPosition });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    loadImages();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (imageId: string) => {
    await supabase.from("listing_images").delete().eq("id", imageId);
    loadImages();
  };

  return (
    <div>
      <p className="text-warmgray-600 text-sm mb-6">
        Add up to {MAX_PHOTOS} photos. The first photo is used as the cover
        image.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-xl overflow-hidden bg-warmgray-100"
          >
            <Image
              src={img.url}
              alt=""
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length < MAX_PHOTOS && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border border-dashed border-warmgray-200 bg-canvas-card flex flex-col items-center justify-center gap-1 hover:border-warmgray-400 transition-colors disabled:opacity-60"
          >
            <span className="text-2xl text-warmgray-400">+</span>
            <span className="text-xs text-warmgray-400">
              {uploading ? "Uploading..." : "Add photo"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-coral-600 text-sm mb-4">{error}</p>}

      <button
        onClick={() => router.push(`/list-property/success?id=${listingId}`)}
        className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors"
      >
        Done
      </button>
    </div>
  );
}