import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-emerald-400/90">Apex Wealth Management</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-50">Client not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        No mock profile exists for this client ID. Return to a known profile or sign in
        again.
      </p>
      <Link
        href="/dashboard/101"
        className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-500"
      >
        Go to sample dashboard
      </Link>
    </div>
  );
}
