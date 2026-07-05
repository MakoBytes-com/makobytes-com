import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin";
import { LogoutButton } from "../logout-button";

// Every page in this route group is admin-only. The login page lives outside
// the group (app/admin/login) so it isn't gated or wrapped by this shell.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/promptpixel/admin", label: "Overview" },
  { href: "/promptpixel/admin/users", label: "Users" },
  { href: "/promptpixel/admin/releases", label: "Releases" },
  { href: "/promptpixel/admin/analytics", label: "Analytics" },
  { href: "/promptpixel/admin/errors", label: "Errors" },
  { href: "/promptpixel/admin/security", label: "Security" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/promptpixel/admin/login");

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      <aside className="hidden w-52 shrink-0 flex-col border-r border-white/10 p-4 md:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6] text-sm font-black">P</div>
          <span className="font-semibold tracking-tight">PromptPixel Admin</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4"><LogoutButton /></div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 p-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/10">
              {n.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
