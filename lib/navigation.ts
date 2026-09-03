export function isActiveNavigationItem(pathname: string, href: string) {
  pathname = pathname.split(/[?#]/)[0];
  if (
    href === "/blog" &&
    (pathname === "/case-studies" || pathname.startsWith("/case-studies/"))
  )
    return true;
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/experience", label: "경력" },
  { href: "/projects", label: "개인 프로젝트" },
  { href: "/blog", label: "글" },
];
