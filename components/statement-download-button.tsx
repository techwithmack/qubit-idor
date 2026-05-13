"use client";

import { Download } from "lucide-react";
import { useState } from "react";

type Props = {
  statementId: string;
  label: string;
};

export function StatementDownloadButton({ statementId, label }: Props) {
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/download-statement?id=${encodeURIComponent(statementId)}`,
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement-${statementId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-500 disabled:opacity-60"
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      {loading ? "Preparing…" : label}
    </button>
  );
}
