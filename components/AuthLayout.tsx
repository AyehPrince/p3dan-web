import PinIcon from "./PinIcon";

const panelPins = [
  { top: "15%", left: "20%", size: 14 },
  { top: "32%", left: "68%", size: 20 },
  { top: "58%", left: "15%", size: 12 },
  { top: "74%", left: "55%", size: 16 },
  { top: "45%", left: "42%", size: 14 },
];

export default function AuthLayout({
  headline,
  subhead,
  children,
}: {
  headline: string;
  subhead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-[42%] bg-teal-900 relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute inset-0 opacity-40">
          {panelPins.map((pin, i) => (
            <div
              key={i}
              className="absolute"
              style={{ top: pin.top, left: pin.left }}
            >
              <PinIcon size={pin.size} color="#5DCAA5" />
            </div>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <PinIcon size={22} color="#D85A30" />
          <span className="font-heading font-bold text-lg text-canvas">
            p3dan
          </span>
        </div>

        <div className="relative">
          <h2 className="font-heading font-bold text-3xl text-canvas leading-tight mb-3">
            {headline}
          </h2>
          <p className="text-teal-100 text-sm leading-relaxed max-w-xs">
            {subhead}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <PinIcon size={20} />
            <span className="font-heading font-bold text-lg">p3dan</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}