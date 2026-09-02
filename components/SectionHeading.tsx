import Link from "next/link";

export default function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="text-link shrink-0 text-sm font-semibold">
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
