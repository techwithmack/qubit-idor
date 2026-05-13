import { notFound } from "next/navigation";
import { StatementDownloadButton } from "@/components/statement-download-button";
import { getStatementsForUser, getUserById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

type Props = { params: Promise<{ user_id: string }> };

export default async function StatementsPage({ params }: Props) {
  const { user_id } = await params;
  const user = getUserById(user_id);
  if (!user) notFound();

  const statements = getStatementsForUser(user_id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Statements</h2>
        <p className="text-sm text-slate-500">
          Monthly PDF-style exports (mock JSON download) for client {user_id}.
        </p>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-900/40 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Account</th>
                <th className="px-6 py-3 font-medium">Closing value</th>
                <th className="px-6 py-3 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {statements.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-200">
                    {s.month} {s.year}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-slate-400">
                    {s.accountLabel}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium tabular-nums text-slate-100">
                    {formatCurrency(s.closingValue)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatementDownloadButton
                      statementId={s.id}
                      label="Download monthly statement"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Tip for lab participants: the download endpoint trusts the statement{" "}
        <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-[11px]">id</code>{" "}
        query parameter only.
      </p>
    </div>
  );
}
