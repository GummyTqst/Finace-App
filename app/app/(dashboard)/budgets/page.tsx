import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import AddBudgetModal, {
  BudgetMenu,
} from "@/components/budgets/add-budget-modal";

export const dynamic = "force-dynamic";

type BudgetRow = {
  id: string;
  name: string;
  color: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
};

type BudgetsData = {
  month: number;
  year: number;
  totalBudgeted: number;
  totalSpent: number;
  budgets: BudgetRow[];
};

export default async function BudgetsPage() {
  let data: BudgetsData;
  try {
    data = await apiFetch<BudgetsData>("/budgets");
  } catch {
    redirect("/login");
  }

  const monthLabel = new Date(data.year, data.month - 1, 1).toLocaleString(
    "da-DK",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="space-y-400">
      <div className="flex flex-wrap items-start justify-between gap-300">
        <div>
          <h1 className="text-2xl font-bold text-grey-900">Budgets</h1>
          <p className="text-sm text-grey-500 capitalize">{monthLabel}</p>
        </div>
        <AddBudgetModal usedCategories={data.budgets.map((budget) => budget.name)} />
      </div>

      <div className="grid grid-cols-1 gap-400 lg:grid-cols-3">
        <section className="bg-white rounded-2xl p-400">
          <h2 className="text-lg font-bold text-grey-900 mb-200">
            Spending Summary
          </h2>
          <p className="text-sm text-grey-500 mb-300">
            Of your{" "}
            <span className="font-bold text-grey-900">
              {formatCurrency(data.totalBudgeted)}
            </span>{" "}
            budget, you&apos;ve spent{" "}
            <span className="font-bold text-grey-900">
              {formatCurrency(data.totalSpent)}
            </span>
            .
          </p>
          <ul className="divide-y divide-beige-100">
            {data.budgets.length === 0 && (
              <li className="py-300 text-sm text-grey-500">No budgets yet</li>
            )}
            {data.budgets.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between py-150"
              >
                <span className="flex items-center gap-100 text-sm font-medium text-grey-900">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: b.color }}
                  />
                  {b.name}
                </span>
                <span className="text-sm">
                  <span className="font-bold text-grey-900">
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-grey-500">
                    {" "}
                    of {formatCurrency(b.amount)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="lg:col-span-2 space-y-400">
          {data.budgets.length === 0 && (
            <div className="bg-white rounded-2xl p-400 text-sm text-grey-500">
              Create a budget to start tracking your spending.
            </div>
          )}
          {data.budgets.map((b) => (
            <article
              key={b.id}
              className="bg-white rounded-2xl p-400 border-l-4"
              style={{ borderColor: b.color }}
            >
              <div className="flex items-center justify-between mb-250">
                <h2 className="text-lg font-bold text-grey-900">{b.name}</h2>
                <span className="text-sm text-grey-500">
                  Max of {formatCurrency(b.amount)}
                </span>

                <BudgetMenu budget={b} />
              </div>

              <div className="flex items-center justify-between mb-100">
                <span className="text-sm text-grey-500">Spent</span>
                <span className="text-sm text-grey-500">{b.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-beige-100 mb-200">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(b.percentage, 100)}%`,
                    backgroundColor: b.color,
                  }}
                />
              </div>

              <p className="text-sm text-grey-500">
                {b.remaining >= 0
                  ? `You have ${formatCurrency(b.remaining)} left`
                  : `You're over by ${formatCurrency(Math.abs(b.remaining))}`}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
