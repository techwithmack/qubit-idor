import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

type Props = {
  className?: string;
  /** Full-width button (sidebar). Compact when false (header). */
  fullWidth?: boolean;
};

export function LogoutButton({ className = "", fullWidth = true }: Props) {
  return (
    <form action={logoutAction} className={fullWidth ? "block w-full" : "inline-block"}>
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800/60 hover:text-slate-100 ${
          fullWidth ? "w-full" : "w-auto"
        } ${className}`}
      >
        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
        Log out
      </button>
    </form>
  );
}
