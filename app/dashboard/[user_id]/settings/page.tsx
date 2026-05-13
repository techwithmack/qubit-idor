import { Bell, KeyRound } from "lucide-react";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/data";

type Props = { params: Promise<{ user_id: string }> };

export default async function SettingsPage({ params }: Props) {
  const { user_id } = await params;
  const user = getUserById(user_id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Settings</h2>
        <p className="text-sm text-slate-500">
          Preferences for client {user_id} (static lab placeholders).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel flex gap-4 rounded-2xl p-6 ring-1 ring-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80">
            <Bell className="h-5 w-5 text-slate-300" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
            <p className="mt-1 text-sm text-slate-500">
              Trade confirms and statements delivery — configured by your advisor team.
            </p>
          </div>
        </div>
        <div className="glass-panel flex gap-4 rounded-2xl p-6 ring-1 ring-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80">
            <KeyRound className="h-5 w-5 text-slate-300" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Security</h3>
            <p className="mt-1 text-sm text-slate-500">
              MFA enrollment and device trust are managed outside this lab build.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
        <h3 className="text-sm font-semibold text-slate-100">Profile</h3>
        <p className="mt-2 text-sm text-slate-400">
          {user.name} · {user.email}
        </p>
      </div>
    </div>
  );
}
