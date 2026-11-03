import { redirect } from "next/navigation";

import AddBudgetModal, { BudgetMenu } from "@/components/budgets/add-budget-modal";
import {
  BudgetDetailCard,
  BudgetDonut,
  SpendingSummary,
} from "@/components/budgets/budget-visuals";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

type BudgetRow = {
  id: string;
  name: string;
  color: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  latestSpending: {
    id: string;
    description: string;
    amount: number;
    date: string;
  }[];
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
    { month: "long", year: "numeric" },
  );

  return (
    <div className="space-y-500">
      <header className="flex flex-wrap items-start justify-between gap-300">
        <div>
          <h1 className="text-2xl font-bold text-grey-900">Budgets</h1>
          <p className="text-sm capitalize text-grey-500">{monthLabel}</p>
        </div>
        <AddBudgetModal usedCategories={data.budgets.map((budget) => budget.name)} />
      </header>

      <div className="grid grid-cols-1 gap-400 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-2xl bg-white p-400 sm:p-500">
          <div className="flex justify-center py-300">
            <BudgetDonut
              budgets={data.budgets}
              totalSpent={data.totalSpent}
              totalBudgeted={data.totalBudgeted}
            />
          </div>
          <SpendingSummary budgets={data.budgets} />
        </section>

        <div className="space-y-400">
          {data.budgets.length === 0 && (
            <div className="rounded-2xl bg-white p-500 text-sm text-grey-500">
              Create a budget to start tracking your spending.
            </div>
          )}
          {data.budgets.map((budget) => (
            <BudgetDetailCard
              key={budget.id}
              budget={budget}
              menu={<BudgetMenu budget={budget} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
