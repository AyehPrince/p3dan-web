"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-teal-600 text-sm font-medium hover:underline mb-6 inline-block"
    >
      {label}
    </button>
  );
}