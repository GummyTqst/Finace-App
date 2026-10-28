import BalanceSummaryCard from "@/components/overview/balance-summary-card";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { redirect } from "next/navigation";


type OverviewPot = {
    id: string;
    name: string;
    saved: number;
    color: string;
}

type OverviewData = {
  totalBalance: number;
  income: number;
  expenses: number;
  potsTotal: number;
  potsPreview: OverviewPot[];
  accounts: {
    id: string;
    name: string;
    balance: number;
    isLiability: boolean;
  }[];
  budgetSummary: {
    id: string;
    name: string;
    color: string;
    amount: number;
    spent: number;
  }[];
  recentTransactions: {
    id: string;
    description: string;
    amount: number;
    type: string;
    date: string;
    category: string;
    categoryColor: string;
    account: string;
  }[];
};

const cardBase = "rounded-2xl p-400";

function SummaryCard({
  title,
  value,
  dark,
}: {
  title: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${cardBase} ${dark ? "bg-grey-900 text-white" : "bg-white text-grey-900"}`}
    >
      <p className={`text-sm ${dark ? "text-grey-300" : "text-grey-500"}`}>
        {title}
      </p>
      <p className="mt-100 text-2xl font-bold">{value}</p>
    </div>
  );
}


export function PotsSummary({
    pots = [],
    totalSaved,
}: {
    pots?: OverviewPot[]
    totalSaved: number
}) {
    const visiblePots = pots.slice(0, 4);

    return (
      <section className="rounded-2xl bg-white p-8 shadow-sm">
          {/* Header */}
          <header className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">Pots</h2>
              <Link
                  href="/pots"
                  className="flex items-center gap-2 text-sm font-normal text-slate-500 hover:text-slate-900 transition-colors"
              >
                  See Details
                  <span className="text-xs">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.76531 1.98468L8.51531 5.73468C8.55018 5.76951 8.57784 5.81087 8.59671 5.85639C8.61558 5.90192 8.6253 5.95071 8.6253 5.99999C8.6253 6.04928 8.61558 6.09807 8.59671 6.1436C8.57784 6.18912 8.55018 6.23048 8.51531 6.26531L4.76531 10.0153C4.71287 10.0678 4.64602 10.1036 4.57324 10.1181C4.50046 10.1326 4.42501 10.1251 4.35645 10.0967C4.2879 10.0683 4.22931 10.0202 4.18811 9.95849C4.1469 9.89677 4.12494 9.82421 4.125 9.75L4.125 2.24999C4.12494 2.17578 4.1469 2.10322 4.18811 2.0415C4.22931 1.97978 4.2879 1.93167 4.35645 1.90326C4.42501 1.87485 4.50046 1.86743 4.57324 1.88192C4.64602 1.89641 4.71287 1.93218 4.76531 1.98468Z" fill="#696868"/>
                    </svg>
                  </span>
              </Link>
          </header>

          {/* Content Container */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Total Saved Card */}
              <div className="flex items-center gap-4 bg-beige-100 p-4 rounded-xl w-full sm:w-1/2">
                  <div className="flex items-center justify-center rounded-lg text-emerald-700">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M28.4375 7.8875V5C28.4375 4.41984 28.207 3.86344 27.7968 3.4532C27.3866 3.04297 26.8302 2.8125 26.25 2.8125H13.75C13.1698 2.8125 12.6134 3.04297 12.2032 3.4532C11.793 3.86344 11.5625 4.41984 11.5625 5V7.8875C10.1688 8.11196 8.90036 8.82505 7.98427 9.89915C7.06819 10.9733 6.5642 12.3383 6.5625 13.75V31.25C6.5625 32.8247 7.18806 34.3349 8.30155 35.4484C9.41505 36.5619 10.9253 37.1875 12.5 37.1875H27.5C29.0747 37.1875 30.5849 36.5619 31.6984 35.4484C32.8119 34.3349 33.4375 32.8247 33.4375 31.25V13.75C33.4358 12.3383 32.9318 10.9733 32.0157 9.89915C31.0996 8.82505 29.8312 8.11196 28.4375 7.8875ZM26.5625 5V7.8125H23.4375V4.6875H26.25C26.3329 4.6875 26.4124 4.72042 26.471 4.77903C26.5296 4.83763 26.5625 4.91712 26.5625 5ZM18.4375 7.8125V4.6875H21.5625V7.8125H18.4375ZM13.75 4.6875H16.5625V7.8125H13.4375V5C13.4375 4.91712 13.4704 4.83763 13.529 4.77903C13.5876 4.72042 13.6671 4.6875 13.75 4.6875ZM31.5625 31.25C31.5625 31.7835 31.4574 32.3118 31.2533 32.8047C31.0491 33.2975 30.7499 33.7454 30.3726 34.1226C29.9954 34.4999 29.5475 34.7991 29.0547 35.0033C28.5618 35.2074 28.0335 35.3125 27.5 35.3125H12.5C11.9665 35.3125 11.4382 35.2074 10.9453 35.0033C10.4525 34.7991 10.0046 34.4999 9.62738 34.1226C9.25014 33.7454 8.9509 33.2975 8.74674 32.8047C8.54258 32.3118 8.4375 31.7835 8.4375 31.25V13.75C8.4375 12.6726 8.86551 11.6392 9.62738 10.8774C10.3892 10.1155 11.4226 9.6875 12.5 9.6875H27.5C28.5774 9.6875 29.6108 10.1155 30.3726 10.8774C31.1345 11.6392 31.5625 12.6726 31.5625 13.75V31.25ZM24.6875 25C24.6875 25.9117 24.3253 26.786 23.6807 27.4307C23.036 28.0753 22.1617 28.4375 21.25 28.4375H20.9375V30C20.9375 30.2486 20.8387 30.4871 20.6629 30.6629C20.4871 30.8387 20.2486 30.9375 20 30.9375C19.7514 30.9375 19.5129 30.8387 19.3371 30.6629C19.1613 30.4871 19.0625 30.2486 19.0625 30V28.4375H17.5C17.2514 28.4375 17.0129 28.3387 16.8371 28.1629C16.6613 27.9871 16.5625 27.7486 16.5625 27.5C16.5625 27.2514 16.6613 27.0129 16.8371 26.8371C17.0129 26.6613 17.2514 26.5625 17.5 26.5625H21.25C21.6644 26.5625 22.0618 26.3979 22.3549 26.1049C22.6479 25.8118 22.8125 25.4144 22.8125 25C22.8125 24.5856 22.6479 24.1882 22.3549 23.8951C22.0618 23.6021 21.6644 23.4375 21.25 23.4375H18.75C17.8383 23.4375 16.964 23.0753 16.3193 22.4307C15.6747 21.786 15.3125 20.9117 15.3125 20C15.3125 19.0883 15.6747 18.214 16.3193 17.5693C16.964 16.9247 17.8383 16.5625 18.75 16.5625H19.0625V15C19.0625 14.7514 19.1613 14.5129 19.3371 14.3371C19.5129 14.1613 19.7514 14.0625 20 14.0625C20.2486 14.0625 20.4871 14.1613 20.6629 14.3371C20.8387 14.5129 20.9375 14.7514 20.9375 15V16.5625H22.5C22.7486 16.5625 22.9871 16.6613 23.1629 16.8371C23.3387 17.0129 23.4375 17.2514 23.4375 17.5C23.4375 17.7486 23.3387 17.9871 23.1629 18.1629C22.9871 18.3387 22.7486 18.4375 22.5 18.4375H18.75C18.3356 18.4375 17.9382 18.6021 17.6451 18.8951C17.3521 19.1882 17.1875 19.5856 17.1875 20C17.1875 20.4144 17.3521 20.8118 17.6451 21.1049C17.9382 21.3979 18.3356 21.5625 18.75 21.5625H21.25C22.1617 21.5625 23.036 21.9247 23.6807 22.5693C24.3253 23.214 24.6875 24.0883 24.6875 25Z" fill="#277C78"/>
                    </svg>
                  </div>

                  <div className="flex flex-col">
                      <p className="text-xs text-slate-500 font-medium">Total Saved</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                          {formatCurrency(totalSaved)}
                      </p>
                  </div>
              </div>

              {/* Pots List (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 w-full sm:w-1/2">
                  {visiblePots.map((pot) => (
                      <div key={pot.id} className="flex items-center gap-3">
                          {/* Color Tag Bar */}
                          <span
                              className="h-10 w-1 rounded-full shrink-0"
                              style={{ backgroundColor: pot.color }}
                          />

                          <div className="flex flex-col">
                              <p className="text-xs text-slate-500 truncate">{pot.name}</p>
                              <p className="text-sm font-bold text-slate-900">
                                  {formatCurrency(pot.saved)}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );
}



export default async function OverviewPage() {
  let data: OverviewData;
  try {
    data = await apiFetch<OverviewData>("/overview");
  } catch {
    redirect("/login");
  }

  const net = data.income - data.expenses;
  const netPct = data.income > 0 ? Math.round((net / data.income) * 100) : 0;

  return (
    <div className="space-y-400">
      <div>
        <h1 className="text-2xl font-bold text-grey-900">Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-300 sm:grid-cols-2 xl:grid-cols-3">
        <BalanceSummaryCard 
          accounts={data.accounts}
          totalBalance={data.totalBalance}
        />
        <SummaryCard
          title="Income"
          value={`${formatCurrency(data.income)}`}
        />
        <SummaryCard
          title="Expenses"
          value={`${formatCurrency(data.expenses)}`}
        />
      </div>

        <div className="grid grid-cols-1 gap-400 lg:grid-cols-[1fr_2fr_1fr_1fr]">
            <div className="space-y-400 lg:col-span-2">

                <PotsSummary 
                    totalSaved={data.potsTotal}
                    pots={data.potsPreview}
                />

                <div>
                    <section className={`${cardBase} bg-white lg:col-span-2`}>
                        <header className="flex items-center justify-between mb-300">
                            <h2 className="text-lg font-bold text-grey-900">
                            Recent Transactions
                            </h2>
                            <Link
                            href="/transactions"
                            className="text-sm font-medium text-grey-500 hover:text-grey-900"
                            >
                            View All
                            </Link>
                        </header>
                        <ul className="divide-y divide-beige-100">
                            {data.recentTransactions.length === 0 && (
                            <li className="py-300 text-center text-sm text-grey-500">
                                No transactions yet
                            </li>
                            )}
                            {data.recentTransactions.map((t) => (
                            <li
                                key={t.id}
                                className="flex items-center justify-between py-150"
                            >
                                <div className="flex items-center gap-200">
                                <span
                                    className="w-10 h-10 rounded-full"
                                    style={{ backgroundColor: t.categoryColor }}
                                />
                                <div>
                                    <p className="font-medium text-grey-900">{t.description}</p>
                                    <p className="text-xs text-grey-500">{t.category}</p>
                                </div>
                                </div>
                                <span
                                className={`font-bold ${t.type === "income" ? "text-green" : "text-grey-900"}`}
                                >
                                {t.type === "income" ? "+" : "-"}
                                {formatCurrency(t.amount)}
                                </span>
                            </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            <div className="space-y-400 lg:col-span-2">
                <div>
                    <section className={`${cardBase} bg-white`}>
                        <header className="flex items-center justify-between mb-300">
                            <h2 className="text-lg font-bold text-grey-900">Budgets</h2>
                            <Link
                            href="/budgets"
                            className="text-sm font-medium text-grey-500 hover:text-grey-900"
                            >
                            See Details
                            </Link>
                        </header>
                        <ul className="space-y-250">
                            {data.budgetSummary.length === 0 && (
                            <li className="text-sm text-grey-500">
                                No budgets for this month
                            </li>
                            )}
                            {data.budgetSummary.map((b) => (
                            <li key={b.id}>
                                <div className="flex items-center justify-between mb-100">
                                <span className="flex items-center gap-100 text-sm font-medium text-grey-900">
                                    <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: b.color }}
                                    />
                                    {b.name}
                                </span>
                                <span className="text-sm text-grey-500">
                                    {formatCurrency(b.spent)}
                                </span>
                                </div>
                                <div className="h-2 rounded-full bg-beige-100">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                    width: `${Math.min((b.spent / b.amount) * 100, 100)}%`,
                                    backgroundColor: b.color,
                                    }}
                                />
                                </div>
                            </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <div>
                    RecurringBills
                </div>
            </div>
        </div>
    </div>
  );
}
