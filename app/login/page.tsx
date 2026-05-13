import { Lock, Shield } from "lucide-react";
import Link from "next/link";
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const showError = error === "1";

  return (
    <div className="login-backdrop relative flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 shadow-2xl shadow-emerald-950/20 ring-1 ring-white/5">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/30">
              <Shield className="h-7 w-7 text-emerald-400" aria-hidden />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
              Apex Wealth Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Client Portal
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Secure access to portfolio analytics and documents.
            </p>
          </div>

          <form action={loginAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="john@apex.lab"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {showError ? (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-200">
                Invalid email or password.
              </p>
            ) : null}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-900/40 transition hover:from-emerald-500 hover:to-emerald-400"
            >
              <Lock className="h-4 w-4" aria-hidden />
              Sign in securely
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
            Demo:{" "}
            <span className="text-slate-400">john@apex.lab</span> /{" "}
            <span className="font-mono text-slate-300">password101</span>
          </p>
        </div>
        <p className="mt-6 text-center text-[11px] text-slate-500">
          Need help?{" "}
          <Link href="/login" className="text-emerald-400/80 hover:text-emerald-300">
            Contact concierge
          </Link>
        </p>
      </div>
    </div>
  );
}
