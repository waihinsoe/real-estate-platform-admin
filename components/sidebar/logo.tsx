import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="ZawTiKa Home"
      className="inline-flex items-center"
    >
      <div className="flex flex-col justify-center">
        <div className="text-xl font-bold leading-none tracking-tight text-primary sm:text-2xl">
          ZawTiKa
        </div>

        <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
          Real Estate Platform
        </span>
      </div>
    </Link>
  );
}
