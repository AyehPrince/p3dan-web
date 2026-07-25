import { createClient } from "@/lib/supabase/client";

export function compressImage(
  file: File,
  maxWidth = 1080,
  quality = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export async function uploadListingImageWeb(
  file: File,
  userId: string,
  listingId: string
): Promise<string | null> {
  const supabase = createClient();
  try {
    const compressedBlob = await compressImage(file);
    const fileName = `${Date.now()}.jpg`;
    const path = `${userId}/${listingId}/${fileName}`;

    const { error } = await supabase.storage
      .from("listings")
      .upload(path, compressedBlob, { contentType: "image/jpeg" });

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("listings").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("Image upload failed:", err);
    return null;
  }
}