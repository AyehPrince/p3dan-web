"use client";

import { passwordRequirements } from "@/lib/validation";

export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {passwordRequirements.map((req) => {
        const met = req.test(password);
        return (
          <li
            key={req.id}
            className={`text-xs flex items-center gap-1.5 ${
              met ? "text-teal-600" : "text-warmgray-400"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${
                met ? "bg-teal-600 text-canvas" : "bg-warmgray-100"
              }`}
            >
              {met ? "✓" : ""}
            </span>
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}