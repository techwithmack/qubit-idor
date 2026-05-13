/**
 * Lab Environment: For Educational Use Only.
 */
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { LogoutButton } from "@/components/logout-button";
import { SecurityDisclaimer } from "@/components/security-disclaimer";
import { getUserById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const profile = getUserById(user_id);
  if (!profile) notFound();

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-md md:flex">
        <div className="border-b border-slate-800/80 px-5 py-6">
          <Link href={`/dashboard/${user_id}`} className="block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-500/90">
              Apex
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-50">
              Wealth Management
            </p>
          </Link>
        </div>
        <DashboardNav userId={user_id} />
        <div className="mt-auto space-y-2 border-t border-slate-800/80 px-3 py-3">
          <LogoutButton />
          <SecurityDisclaimer />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/75 px-4 py-4 backdrop-blur-md sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Viewing profile</p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50">
                {profile.name}
              </h1>
              <p className="text-sm text-slate-400">
                {profile.title} · Client ID {user_id}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-200/80">
                    Total portfolio
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-emerald-100">
                    {formatCurrency(profile.totalPortfolioValue)}
                  </p>
                </div>
              </div>
              <div className="md:hidden">
                <LogoutButton fullWidth={false} className="py-2 text-xs sm:text-sm" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 md:hidden">
          <div className="w-full border-b border-slate-800/80 bg-slate-950/40 px-2 py-2">
            <DashboardNav userId={user_id} />
          </div>
        </div>

        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>

        <footer className="border-t border-slate-800/80 md:hidden">
          <SecurityDisclaimer />
        </footer>
      </div>
    </div>
  );
}
