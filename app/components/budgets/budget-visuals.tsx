import Link from "next/link";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/format";

export type BudgetVisual = {
  id: string;
  name: string;
  color: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  latestSpending?: {
    id: string;
    description: string;
    amount: number;
    date: string;
  }[];
};

function colorForBudget(color: string | null | undefined) {
  return color || "#277c78";
}

function donutGradient(budgets: BudgetVisual[]) {
  const total = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  if (!total) return "#d8d3cf 0 100%";

  let position = 0;
  const segments = budgets.map((budget) => {
    const start = position;
    position += (budget.amount / total) * 100;
    return `${colorForBudget(budget.color)} ${start}% ${position}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

export function BudgetDonut({
  budgets,
  totalSpent,
  totalBudgeted,
  compact = false,
  currency = "EUR",
}: {
  budgets: BudgetVisual[];
  totalSpent: number;
  totalBudgeted: number;
  compact?: boolean;
  currency?: string;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${compact ? "h-48 w-48 p-5" : "h-56 w-56 p-6"}`}
      style={{ background: donutGradient(budgets) }}
      aria-label={`${formatCurrency(totalSpent, currency)} spent of ${formatCurrency(totalBudgeted, currency)} budgeted`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
        <strong className={`${compact ? "text-3xl" : "text-4xl"} font-bold text-grey-900`}>
          {formatCurrency(totalSpent, currency)}
        </strong>
        <span className="mt-50 text-xs text-grey-500">
          of {formatCurrency(totalBudgeted, currency)} limit
        </span>
      </div>
    </div>
  );
}

export function SpendingSummary({ budgets, currency = "EUR" }: { budgets: BudgetVisual[]; currency?: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-grey-900">Spending Summary</h2>
      <ul className="mt-300 divide-y divide-beige-100">
        {budgets.length === 0 && (
          <li className="py-300 text-sm text-grey-500">No budgets yet</li>
        )}
        {budgets.map((budget) => (
          <li key={budget.id} className="flex items-center justify-between gap-300 py-250">
            <span className="flex min-w-0 items-center gap-200 text-sm text-grey-500">
              <span
                className="h-5 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: colorForBudget(budget.color) }}
              />
              <span className="truncate">{budget.name}</span>
            </span>
            <span className="shrink-0 text-sm text-grey-500">
              <strong className="font-bold text-grey-900">
                {formatCurrency(budget.spent, currency)}
              </strong>{" "}
              of {formatCurrency(budget.amount, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BudgetDetailCard({
  budget,
  menu,
  currency = "EUR",
}: {
  budget: BudgetVisual;
  menu: ReactNode;
  currency?: string;
}) {
  const color = colorForBudget(budget.color);
  const progress = Math.min(Math.max(budget.percentage, 0), 100);

  return (
    <article className="rounded-2xl bg-white p-400 sm:p-500">
      <header className="flex items-start justify-between gap-300">
        <div className="flex min-w-0 items-center gap-200">
          <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <h2 className="truncate text-lg font-bold text-grey-900">{budget.name}</h2>
        </div>
        {menu}
      </header>

      <p className="mt-300 text-sm text-grey-500">
        Maximum of {formatCurrency(budget.amount, currency)}
      </p>

      <div className="mt-300 h-7 rounded-md bg-beige-100 p-1">
        <div
          className="h-full rounded-md transition-all"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>

      <div className="mt-250 grid grid-cols-2 gap-300">
        <div className="border-l-4 pl-200" style={{ borderColor: color }}>
          <p className="text-xs text-grey-500">Spent</p>
          <p className="mt-50 font-bold text-grey-900">{formatCurrency(budget.spent, currency)}</p>
        </div>
        <div className="border-l-4 border-beige-100 pl-200">
          <p className="text-xs text-grey-500">Remaining</p>
          <p className="mt-50 font-bold text-grey-900">
            {formatCurrency(Math.max(budget.remaining, 0), currency)}
          </p>
        </div>
      </div>

      <div className="mt-400 rounded-xl bg-beige-100 p-300">
        <div className="flex items-center justify-between gap-300">
          <h3 className="font-bold text-grey-900">Latest Spending</h3>
          <span className="text-sm text-grey-500">See All <span aria-hidden="true">›</span></span>
        </div>
        <ul className="mt-200 divide-y divide-[#ded8d3]">
          {(budget.latestSpending ?? []).length === 0 && (
            <li className="py-200 text-sm text-grey-500">No spending yet</li>
          )}
          {(budget.latestSpending ?? []).map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-300 py-200">
              <div className="flex min-w-0 items-center gap-200">
                <span className="h-8 w-8 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="truncate text-xs font-bold text-grey-900">{transaction.description}</span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-grey-900">-{formatCurrency(transaction.amount, currency)}</p>
                <p className="text-xs text-grey-500">
                  {new Date(transaction.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function OverviewBudgetCard({
  budgets,
  currency = "EUR",
}: {
  budgets: Pick<BudgetVisual, "id" | "name" | "color" | "amount" | "spent">[];
  currency?: string;
}) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <section className="rounded-2xl bg-white p-400 sm:p-500">
      <header className="flex items-center justify-between gap-300">
        <h2 className="text-xl font-bold text-grey-900">Budgets</h2>
        <Link href="/budgets" className="text-sm text-grey-500 hover:text-grey-900">
          See Details <span aria-hidden="true">›</span>
        </Link>
      </header>
      <div className="mt-400 flex flex-col items-center gap-500 sm:flex-row sm:items-center">
        <BudgetDonut
          budgets={budgets.map((budget) => ({
            ...budget,
            remaining: budget.amount - budget.spent,
            percentage: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0,
          }))}
          totalSpent={totalSpent}
          totalBudgeted={totalBudgeted}
          compact
          currency={currency}
        />
        <ul className="grid w-full flex-1 grid-cols-2 gap-x-400 gap-y-300 sm:grid-cols-1">
          {budgets.map((budget) => (
            <li key={budget.id} className="flex items-center gap-200">
              <span
                className="h-10 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: colorForBudget(budget.color) }}
              />
              <div>
                <p className="text-xs text-grey-500">{budget.name}</p>
                <p className="text-sm font-bold text-grey-900">{formatCurrency(budget.amount, currency)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
