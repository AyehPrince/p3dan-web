export default function PinIcon({
  size = 20,
  color = "#0F6E56",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        borderBottomLeftRadius: 0,
        backgroundColor: color,
        transform: "rotate(-45deg)",
      }}
    />
  );
}