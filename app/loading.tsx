import PinIcon from "@/components/PinIcon";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <PinIcon size={32} />
      </div>
    </div>
  );
}