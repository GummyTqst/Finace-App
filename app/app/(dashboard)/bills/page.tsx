import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { createBill } from "@/lib/finance-actions";
import { redirect } from "next/navigation";
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
  let data: { bills: Bill[] };
  try {
    data = await apiFetch("/bills");
  } catch {
    redirect("/login");
  }
  const total = data.bills
    .filter((b) => b.active)
    .reduce((s, b) => s + b.amount, 0);
  return (
    <div className="space-y-400">
      <div>
        <h1 className="text-2xl font-bold text-grey-900">Recurring bills</h1>
        <p className="text-sm text-grey-500">
          You have {formatCurrency(total)} in active recurring bills.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-400 lg:grid-cols-3">
        <section className="bg-white rounded-2xl p-400 lg:col-span-2">
          <h2 className="text-lg font-bold text-grey-900 mb-300">Your bills</h2>
          <ul className="divide-y divide-beige-100">
            {data.bills.length === 0 && (
              <li className="py-300 text-sm text-grey-500">
                No recurring bills yet.
              </li>
            )}
            {data.bills.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between py-250"
              >
                <div>
                  <p className="font-medium text-grey-900">{b.name}</p>
                  <p className="text-xs text-grey-500">
                    Due on the {b.dueDay}
                    {b.category ? ` · ${b.category}` : ""}
                    {b.account ? ` · ${b.account}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-grey-900">
                    {formatCurrency(b.amount)}
                  </p>
                  <p
                    className={`text-xs ${
                      b.active ? "text-green" : "text-grey-500"
                    }`}
                  >
                    {b.active ? "Active" : "Paused"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-white rounded-2xl p-400">
          <h2 className="text-lg font-bold text-grey-900 mb-300">
            Add recurring bill
          </h2>
          <form action={createBill} className="space-y-200">
            <input
              name="name"
              required
              placeholder="Bill name"
              className="field"
            />
            <input
              name="amount"
              required
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              className="field"
            />
            <input
              name="dueDay"
              required
              type="number"
              min="1"
              max="31"
              placeholder="Due day"
              className="field"
            />
            <input
              name="category"
              placeholder="Category (optional)"
              className="field"
            />
            <input
              name="account"
              placeholder="Account (optional)"
              className="field"
            />
            <button className="button w-full" type="submit">
              Add bill
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
