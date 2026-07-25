import Link from "next/link";
import PinIcon from "./PinIcon";

export default function Footer() {
  return (
    <footer className="border-t border-warmgray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-warmgray-400">
        <div className="flex items-center gap-2">
          <PinIcon size={14} />
          <span>p3dan · Built by PrimeLabs, Accra</span>
        </div>
        <div className="flex gap-5">
          <Link href="/about" className="hover:text-warmgray-600">
            About
          </Link>
          <Link href="/help" className="hover:text-warmgray-600">
            Help
          </Link>
          <Link href="/terms" className="hover:text-warmgray-600">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-warmgray-600">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}