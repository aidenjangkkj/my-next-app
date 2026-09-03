import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { isActiveNavigationItem, navigationItems } from "@/lib/navigation";

export default function Navigation() {
  const router = useRouter();
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const menuOpen = openAtPath === router.asPath;
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="주요 메뉴"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setOpenAtPath(null);
            menuButton.current?.focus();
          }
        }}
      >
        <Link
          href="/"
          className="shrink-0 font-bold tracking-tight text-slate-950"
          onClick={() => setOpenAtPath(null)}
        >
          장석환
          <span className="ml-2 hidden text-sm font-normal text-slate-500 lg:inline">
            Frontend Developer
          </span>
        </Link>
        <button
          ref={menuButton}
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold md:hidden"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setOpenAtPath(menuOpen ? null : router.asPath)}
        >
          {menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        </button>
        <div
          id="primary-navigation"
          className={`${menuOpen ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-slate-200 bg-white px-5 py-4 md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
            {navigationItems.map(({ href, label }) => {
              const active = isActiveNavigationItem(router.asPath, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenAtPath(null)}
                    className={`block rounded px-3 py-2 text-sm font-semibold ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-slate-100 pt-2 md:ml-2 md:mt-0 md:border-l md:border-t-0 md:pl-3 md:pt-0">
              <Link
                href="/contact"
                onClick={() => setOpenAtPath(null)}
                aria-current={
                  isActiveNavigationItem(router.asPath, "/contact")
                    ? "page"
                    : undefined
                }
                className="block rounded px-3 py-2 text-sm font-semibold text-slate-700"
              >
                연락
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
