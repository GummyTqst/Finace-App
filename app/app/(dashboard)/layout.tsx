import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/sidebar";
import { apiFetch } from "@/lib/api";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();

  // Show the dashboard only when logged in
  if (!cookieStore.has("token")) {
    redirect("/login");
  }

  const [accounts, profile] = await Promise.all([
    apiFetch<{
      accounts: { id: string }[];
    }>("/accounts"),
    apiFetch<{
      user: { name: string; email: string };
    }>("/users/me"),
  ]);

  if (accounts.accounts.length === 0) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-beige-100">
      <Sidebar user={profile.user} />
      <main className="flex-1 overflow-y-auto px-1000 py-800">{children}</main>
    </div>
  );
}
