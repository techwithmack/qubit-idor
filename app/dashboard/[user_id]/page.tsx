import { ArrowUpRight, PieChart as PieIcon, LineChart as LineIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { AssetAllocationPie } from "@/components/charts/asset-allocation-pie";
import { PortfolioLineChart } from "@/components/charts/portfolio-line-chart";
import { getUserById } from "@/lib/data";
import { formatCurrency, formatCurrencySigned, formatDate } from "@/lib/format";

type Props = { params: Promise<{ user_id: string }> };

export default async function OverviewPage({ params }: Props) {
  const { user_id } = await params;
  const user = getUserById(user_id);
  if (!user) notFound();

  const sortedTx = [...user.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const first = user.portfolioHistory[0]?.value ?? 0;
  const last = user.portfolioHistory[user.portfolioHistory.length - 1]?.value ?? 0;
  const delta = last - first;
  const deltaPct = first ? ((delta / first) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total portfolio value
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-50 sm:text-4xl">
              {formatCurrency(user.totalPortfolioValue)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-emerald-400/90">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
              <span>
                {formatCurrencySigned(delta)} ({deltaPct}%) over displayed range
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Cash & equivalents
            </p>
            <p className="text-lg font-semibold tabular-nums text-slate-100">
              {formatCurrency(user.cashBalance)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <div className="mb-4 flex items-center gap-2">
            <LineIcon className="h-4 w-4 text-emerald-400" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-100">Growth trajectory</h2>
          </div>
          <PortfolioLineChart data={user.portfolioHistory} />
        </section>

        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <div className="mb-4 flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-emerald-400" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-100">Asset allocation</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AssetAllocationPie data={user.allocations} />
            <ul className="flex flex-col justify-center gap-2 text-sm">
              {user.allocations.map((a) => (
                <li key={a.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    {a.name}
                  </span>
                  <span className="tabular-nums text-slate-400">{a.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/5">
        <div className="border-b border-slate-800/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Recent transactions</h2>
          <p className="text-xs text-slate-500">Latest activity across linked accounts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedTx.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-3 text-slate-400">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-3 text-slate-200">{t.description}</td>
                  <td className="px-6 py-3 capitalize text-slate-500">{t.type}</td>
                  <td
                    className={`px-6 py-3 text-right font-medium tabular-nums ${
                      t.amount >= 0 ? "text-emerald-400" : "text-rose-300"
                    }`}
                  >
                    {formatCurrencySigned(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
