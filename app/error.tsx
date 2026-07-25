"use client";

import Link from "next/link";
import PinIcon from "@/components/PinIcon";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-coral-400 flex items-center justify-center mb-5">
        <PinIcon size={22} color="#EDE7DC" />
      </div>
      <h1 className="font-heading font-bold text-2xl mb-2">Something went wrong</h1>
      <p className="text-warmgray-600 mb-8 max-w-sm">
        We hit a snag loading this page. You can try again, or head back home.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-warmgray-200 text-warmgray-700 rounded-xl px-6 py-3 font-medium hover:bg-canvas-card transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}