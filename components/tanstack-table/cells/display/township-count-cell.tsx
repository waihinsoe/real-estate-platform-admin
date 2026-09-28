import { LocationSvg } from "@/components/svg/location-svg";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TownshipCountCell({
  count,
  regionId,
}: {
  count: number;
  regionId?: number;
}) {
  const href = regionId === undefined ? undefined : {
    pathname: "/townships",
    query: { region_id: regionId },
  };
  const displayCount = count.toLocaleString();
  const className = cn(
    "inline-flex h-10 items-center gap-2 rounded-lg border border-border/70 bg-background py-1 pr-2.5 pl-1.5 text-foreground no-underline",
    href && "cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  );
  const content = (
    <>
      <LocationSvg className="size-7 shrink-0" />
      <span className="min-w-4 text-center text-sm font-semibold tabular-nums">
        {displayCount}
      </span>
      {href && (
        <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  return href ? (
    <Link href={href} className={className} aria-label={`View ${displayCount} townships`}>
      {content}
    </Link>
  ) : (
    <span className={className} aria-label={`${displayCount} townships`}>{content}</span>
  );
}
