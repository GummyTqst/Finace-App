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
  let accounts: { id: string; name: string }[] = [];
  let categories: { id: string; name: string }[] = [];
  try {
    const [billsData, accountsData, categoriesData] = await Promise.all([
      apiFetch<{ currency: string; bills: Bill[] }>("/bills"),
      apiFetch<{ accounts: { id: string; name: string }[] }>("/accounts"),
      apiFetch<{ categories: { id: string; name: string }[] }>("/categories"),
    ]);
    data = billsData;
    accounts = accountsData.accounts;
    categories = categoriesData.categories;
  } catch {
    redirect("/login");
  }
  return <RecurringBillsPage bills={data.bills} currency={data.currency} accounts={accounts} categories={categories} />;
}
