import Link from "next/link";
import PinIcon from "@/components/PinIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-canvas-card border border-warmgray-100 flex items-center justify-center mb-5">
        <PinIcon size={22} color="#B4B2A9" />
      </div>
      <h1 className="font-heading font-bold text-2xl mb-2">Page not found</h1>
      <p className="text-warmgray-600 mb-8 max-w-sm">
        This page doesn&apos;t exist, or the listing may have been removed.
      </p>
      <Link
        href="/"
        className="bg-teal-600 text-canvas rounded-xl px-6 py-3 font-medium hover:bg-teal-800 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}