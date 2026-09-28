import type { SVGProps } from "react";

export function LocationSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
      <ellipse cx="16" cy="28" rx="9" ry="2" fill="#F87171" opacity=".2" />
      <path d="M26 12c0 7-10 15-10 15S6 19 6 12a10 10 0 1 1 20 0Z" fill="#EF4444" />
      <path d="M16 2a10 10 0 0 1 10 10c0 7-10 15-10 15s6-9 6-15c0-4.5-2.5-8-6-10Z" fill="#DC2626" />
      <path d="M9 11a7 7 0 0 1 5-6" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="12" r="4" fill="#FFF1F2" />
      <circle cx="16" cy="12" r="2" fill="#FECDD3" />
    </svg>
  );
}
