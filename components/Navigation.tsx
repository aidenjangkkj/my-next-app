import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { isActiveNavigationItem } from "@/lib/navigation";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/projects", label: "프로젝트" },
  { href: "/blog", label: "블로그" },
  { href: "/contact", label: "연락하기" },
];

export default function Navigation() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-gray-900 text-white shadow-lg">
      <nav
        className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
        aria-label="주요 메뉴"
      >
        <Link
          href="/"
          className="rounded-sm text-xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
        >
          나의 포트폴리오
        </Link>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-md p-2 text-2xl leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 md:hidden"
        >
          <span aria-hidden>{menuOpen ? "×" : "☰"}</span>
        </button>

        <div
          id="primary-navigation"
          className={`${menuOpen ? "block" : "hidden"} absolute left-0 right-0 top-full bg-gray-900 px-4 pb-4 shadow-lg md:static md:block md:bg-transparent md:p-0 md:shadow-none`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            {navigationItems.map((item) => {
              const isActive = isActiveNavigationItem(
                router.pathname,
                item.href,
              );

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
