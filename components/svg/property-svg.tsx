import type { SVGProps } from "react";

export function PropertySvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <ellipse cx="16" cy="28" rx="12" ry="2" fill="#60A5FA" opacity=".18" />
      <path
        d="M6 14 16 6l10 8v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V14Z"
        fill="#DBEAFE"
      />
      <path d="m16 6 10 8v11a2 2 0 0 1-2 2h-8V6Z" fill="#93C5FD" />
      <path d="M23 10V5h-4v2l4 3Z" fill="#3B82F6" />
      <path
        d="m4 15 12-10 12 10"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 27v-7a2 2 0 0 1 4 0v7" fill="#2563EB" />
      <rect x="8" y="16" width="4" height="4" rx="1" fill="#60A5FA" />
      <rect x="20" y="16" width="4" height="4" rx="1" fill="#EFF6FF" />
    </svg>
  );
}
