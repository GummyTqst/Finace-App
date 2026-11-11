import { apiFetch } from "@/lib/api";
import { redirect } from "next/navigation";
import RecurringBillsPage from "@/components/recurring-bills/recurring-bills-page";
type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category?: string | null;
  account?: string | null;
  active: boolean;
};
export default async function BillsPage() {
  let data: { currency: string; bills: Bill[] };
  try {
    data = await apiFetch("/bills");
  } catch {
    redirect("/login");
  }
  return <RecurringBillsPage bills={data.bills} currency={data.currency} />;
}
