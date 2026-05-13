import { notFound } from "next/navigation";
import { getUserById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

type Props = { params: Promise<{ user_id: string }> };

export default async function AccountsPage({ params }: Props) {
  const { user_id } = await params;
  const user = getUserById(user_id);
  if (!user) notFound();

  const invested = user.totalPortfolioValue - user.cashBalance;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Accounts</h2>
        <p className="text-sm text-slate-500">
          Consolidated balances for client {user_id} — Apex custody &amp; advisory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Invested assets</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-50">
            {formatCurrency(invested)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Across model portfolios and sleeve strategies.
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Cash &amp; liquidity</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-200">
            {formatCurrency(user.cashBalance)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Sweep vehicle yield shown net of fees (mock).
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
        <h3 className="text-sm font-semibold text-slate-100">Relationship summary</h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4 border-b border-slate-800/60 py-2">
            <dt className="text-slate-500">Primary contact</dt>
            <dd className="text-slate-200">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-800/60 py-2">
            <dt className="text-slate-500">Title</dt>
            <dd className="text-slate-200">{user.title}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-800/60 py-2">
            <dt className="text-slate-500">Reporting email</dt>
            <dd className="font-mono text-xs text-slate-300">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-800/60 py-2">
            <dt className="text-slate-500">Client ID</dt>
            <dd className="font-mono text-slate-200">{user_id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
