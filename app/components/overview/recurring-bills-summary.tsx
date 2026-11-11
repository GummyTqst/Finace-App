import Link from "next/link";

import { formatCurrency } from "@/lib/format";

type Props = {
  currency: string;
  summary: {
    paid: number;
    upcoming: number;
    dueSoon: number;
  };
};

const rows = [
  { key: "paid", label: "Paid Bills", color: "border-green" },
  { key: "upcoming", label: "Total Upcoming", color: "border-yellow" },
  { key: "dueSoon", label: "Due Soon", color: "border-cyan" },
] as const;

export default function RecurringBillsSummary({ currency, summary }: Props) {
  return (
    <section className="rounded-2xl bg-white p-500 shadow-sm">
      <header className="flex items-center justify-between gap-300">
        <h2 className="text-xl font-bold text-grey-900">Recurring Bills</h2>
        <Link href="/bills" className="flex items-center gap-200 text-sm text-grey-500 hover:text-grey-900">
          See Details <span aria-hidden="true">›</span>
        </Link>
      </header>
      <div className="mt-400 space-y-250">
        {rows.map((row) => (
          <div key={row.key} className={`flex items-center justify-between gap-300 rounded-xl border-l-4 bg-beige-100 px-300 py-350 ${row.color}`}>
            <span className="text-base text-grey-500">{row.label}</span>
            <strong className="text-lg text-grey-900">{formatCurrency(summary[row.key], currency)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
