"use client";

import {
  FileText,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav({ userId }: { userId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${userId}`;

  const links: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    match: (path: string) => boolean;
  }[] = [
    {
      href: base,
      label: "Overview",
      icon: LayoutDashboard,
      match: (path) => path === base || path === `${base}/`,
    },
    {
      href: `${base}/accounts`,
      label: "Accounts",
      icon: Wallet,
      match: (path) =>
        path === `${base}/accounts` || path.startsWith(`${base}/accounts/`),
    },
    {
      href: `${base}/statements`,
      label: "Statements",
      icon: FileText,
      match: (path) =>
        path === `${base}/statements` ||
        path.startsWith(`${base}/statements/`),
    },
    {
      href: `${base}/settings`,
      label: "Settings",
      icon: Settings,
      match: (path) =>
        path === `${base}/settings` || path.startsWith(`${base}/settings/`),
    },
  ];

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {links.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/25"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
