"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/promptpixel/admin/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10">
      Sign out
    </button>
  );
}
