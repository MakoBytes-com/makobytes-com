import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin" });
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg border border-[#dbdbdb] px-3 py-1.5 text-xs text-[#555555] transition hover:border-[#DC2626]/50 hover:text-[#DC2626]"
      >
        <LogOut className="h-3 w-3" />
        Sign out
      </button>
    </form>
  );
}
