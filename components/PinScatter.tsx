import PinIcon from "./PinIcon";

const scatterPins = [
  { top: "12%", left: "18%", label: "Adenta", size: 16, color: "#0F6E56" },
  { top: "28%", left: "62%", label: "Osu", size: 22, color: "#D85A30" },
  { top: "55%", left: "12%", label: "Ashaley Botwe", size: 14, color: "#0F6E56" },
  { top: "68%", left: "72%", label: "Ayigya", size: 18, color: "#0F6E56" },
  { top: "40%", left: "40%", label: "East Legon", size: 16, color: "#0F6E56" },
  { top: "80%", left: "38%", label: "Bantama", size: 14, color: "#0F6E56" },
];

export default function PinScatter() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {scatterPins.map((pin) => (
        <div
          key={pin.label}
          className="absolute flex flex-col items-center gap-1.5"
          style={{ top: pin.top, left: pin.left }}
        >
          <PinIcon size={pin.size} color={pin.color} />
          <span className="text-[11px] text-warmgray-400 font-medium whitespace-nowrap">
            {pin.label}
          </span>
        </div>
      ))}
    </div>
  );
}