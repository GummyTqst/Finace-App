"use client";

import { useState } from "react";

import {
  createBill,
  deleteBill,
  editBill,
  markBillPaid,
  toggleBill,
} from "@/lib/finance-actions";
import { formatCurrency } from "@/lib/format";

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category?: string | null;
  account?: string | null;
  accountId?: string | null;
  categoryId?: string | null;
  active: boolean;
  lastPaidDate?: string | null;
  nextDueDate?: string | null;
  autoCreate: boolean;
};

type Props = {
  bills: Bill[];
  currency: string;
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
};

type BillFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  bill?: Bill;
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onCancel?: () => void;
};

function BillForm({ action, bill, accounts, categories, onCancel }: BillFormProps) {
  return (
    <form action={action} className="grid gap-200 sm:grid-cols-2 lg:grid-cols-5">
      {bill && <input type="hidden" name="id" value={bill.id} />}
      <input name="name" required defaultValue={bill?.name} placeholder="Bill name" className="field" />
      <input name="amount" required type="number" min="0.01" step="0.01" defaultValue={bill?.amount} placeholder="Amount" className="field" />
      <input name="dueDay" required type="number" min="1" max="31" defaultValue={bill?.dueDay} placeholder="Due day" className="field" />
      <select name="accountId" required defaultValue={bill?.accountId ?? ""} className="field">
        <option value="" disabled>Select account</option>
        {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
      </select>
      <select name="categoryId" defaultValue={bill?.categoryId ?? ""} className="field">
        <option value="">No category</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <label className="flex items-center gap-200 rounded-lg border border-beige-500 px-300 py-250 text-sm text-grey-900 sm:col-span-2 lg:col-span-5">
        <input type="checkbox" name="autoCreate" defaultChecked={bill?.autoCreate ?? false} />
        Automatically create an expense transaction when this bill is due
      </label>
      <div className="flex gap-200 sm:col-span-2 lg:col-span-5">
        <button className="button" type="submit">{bill ? "Save changes" : "Add bill"}</button>
        {onCancel && <button className="button-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

const iconStyles = [
  "bg-[#c94736] text-white",
  "bg-[#f2cdac] text-white",
  "bg-[#277c78] text-white",
  "bg-[#826cb0] text-white",
  "bg-[#c47b50] text-white",
  "bg-[#af81ba] text-white",
  "bg-[#597c7c] text-white",
  "bg-[#626070] text-white",
];

function BillIcon({ index }: { index: number }) {
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconStyles[index % iconStyles.length]}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M6 4.75h12v14.5l-3-1.8-3 1.8-3-1.8-3 1.8V4.75Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9h6M9 12h6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ordinal(day: number) {
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix}`;
}

function daysUntilDue(day: number) {
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return day >= currentDay ? day - currentDay : daysInMonth - currentDay + day;
}

function isPaidThisMonth(bill: Bill) {
  if (!bill.lastPaidDate) return false;
  const paidAt = new Date(bill.lastPaidDate);
  const now = new Date();
  return paidAt.getFullYear() === now.getFullYear() && paidAt.getMonth() === now.getMonth();
}

export default function RecurringBillsPage({ bills, currency, accounts, categories }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [showAddForm, setShowAddForm] = useState(false);

  const activeBills = bills.filter((bill) => bill.active);
  const total = activeBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = activeBills.filter(isPaidThisMonth);
  const upcomingBills = activeBills.filter((bill) => !isPaidThisMonth(bill));
  const dueSoon = upcomingBills.filter((bill) => daysUntilDue(bill.dueDay) <= 7);
  const paidTotal = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const upcomingTotal = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const dueSoonTotal = dueSoon.reduce((sum, bill) => sum + bill.amount, 0);

  const visibleBills = [...bills.filter((bill) =>
      `${bill.name} ${bill.category ?? ""} ${bill.account ?? ""}`.toLowerCase().includes(search.toLowerCase()),
    )].sort((a, b) => {
      if (sort === "amount") return b.amount - a.amount;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "earliest") return daysUntilDue(a.dueDay) - daysUntilDue(b.dueDay);
      return daysUntilDue(b.dueDay) - daysUntilDue(a.dueDay);
    });

  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  return (
    <div className="space-y-500">
      <header className="flex flex-wrap items-center justify-between gap-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-grey-900">Recurring Bills</h1>
          <p className="mt-100 text-sm text-grey-500">Keep track of your regular payments.</p>
        </div>
        <button type="button" className="button" onClick={() => setShowAddForm((open) => !open)}>
          {showAddForm ? "Close" : "+ Add bill"}
        </button>
      </header>

      {showAddForm && (
        <section className="rounded-2xl bg-white p-400 shadow-sm">
          <h2 className="text-lg font-bold text-grey-900">Add recurring bill</h2>
          <div className="mt-300"><BillForm action={createBill} accounts={accounts} categories={categories} /></div>
        </section>
      )}

      <div className="grid gap-400 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <aside className="space-y-400">
          <section className="rounded-2xl bg-grey-900 p-600 text-white shadow-sm">
            <svg viewBox="0 0 32 32" className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M7 5.5h18v21l-4.5-2.7-4.5 2.7-4.5-2.7L7 26.5v-21Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 12h10M11 16h10" strokeLinecap="round" />
            </svg>
            <p className="mt-700 text-sm text-grey-300">Total Bills</p>
            <p className="mt-150 text-4xl font-bold tracking-tight">{formatCurrency(total, currency)}</p>
          </section>

          <section className="rounded-2xl bg-white p-500 shadow-sm">
            <h2 className="text-lg font-bold text-grey-900">Summary</h2>
            <dl className="mt-300 divide-y divide-beige-100">
              <div className="flex items-center justify-between gap-300 py-250">
                <dt className="text-sm text-grey-500">Active Bills</dt>
                <dd className="text-sm font-bold text-grey-900">{activeBills.length} ({formatCurrency(total, currency)})</dd>
              </div>
              <div className="flex items-center justify-between gap-300 py-250">
                <dt className="text-sm text-grey-500">Upcoming</dt>
                <dd className="text-sm font-bold text-grey-900">{upcomingBills.length} ({formatCurrency(upcomingTotal, currency)})</dd>
              </div>
              <div className="flex items-center justify-between gap-300 py-250">
                <dt className="text-sm text-green">Paid this month</dt>
                <dd className="text-sm font-bold text-green">{paidBills.length} ({formatCurrency(paidTotal, currency)})</dd>
              </div>
              <div className="flex items-center justify-between gap-300 py-250">
                <dt className="text-sm text-red-600">Due Soon</dt>
                <dd className="text-sm font-bold text-red-600">{dueSoon.length} ({formatCurrency(dueSoonTotal, currency)})</dd>
              </div>
            </dl>
          </section>
        </aside>

        <section className="min-w-0 rounded-2xl bg-white p-400 shadow-sm sm:p-500">
          <div className="flex flex-col gap-300 border-b border-beige-100 pb-400 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-md">
              <span className="sr-only">Search bills</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bills" className="field pl-400 pr-1000" />
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-300 top-1/2 h-5 w-5 -translate-y-1/2 text-grey-900" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" />
              </svg>
            </label>
            <label className="flex items-center gap-200 text-sm text-grey-500">
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-beige-500 bg-white px-300 py-250 text-sm text-grey-900">
                <option value="latest">Latest</option>
                <option value="earliest">Earliest due</option>
                <option value="amount">Highest amount</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_8rem_7rem] gap-300 px-200 py-300 text-xs text-grey-500 sm:grid-cols-[minmax(0,1fr)_10rem_7rem]">
            <span>Bill Title</span><span>Due Date</span><span className="text-right">Amount</span>
          </div>
          <ul className="divide-y divide-beige-100">
            {visibleBills.length === 0 && <li className="px-200 py-700 text-center text-sm text-grey-500">No recurring bills found.</li>}
            {visibleBills.map((bill, index) => {
              const isDueSoon = daysUntilDue(bill.dueDay) <= 7;
              const paidThisMonth = isPaidThisMonth(bill);
              return (
                <li key={bill.id} className={`px-200 py-350 ${!bill.active ? "opacity-55" : ""}`}>
                  <div className="grid grid-cols-[minmax(0,1fr)_8rem_7rem] items-center gap-300 sm:grid-cols-[minmax(0,1fr)_10rem_7rem]">
                  <div className="flex min-w-0 items-center gap-250">
                    <BillIcon index={index} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-grey-900">{bill.name}</p>
                      {(bill.category || bill.account) && <p className="truncate text-xs text-grey-500">{bill.category ?? bill.account}</p>}
                    </div>
                  </div>
                  <span className={`flex items-center gap-150 text-xs sm:text-sm ${!bill.active ? "text-grey-500" : isDueSoon ? "text-red-600" : "text-green"}`}>
                    {paidThisMonth ? "Paid" : `Monthly-${ordinal(bill.dueDay)}`}
                    <span className={`grid h-4 w-4 place-items-center rounded-full text-[10px] text-white ${!bill.active ? "bg-grey-500" : paidThisMonth || !isDueSoon ? "bg-green" : "bg-red-600"}`}>{!bill.active ? "–" : paidThisMonth || !isDueSoon ? "✓" : "!"}</span>
                  </span>
                  <span className={`text-right text-sm font-bold ${isDueSoon && !paidThisMonth ? "text-red-600" : "text-grey-900"}`}>{formatCurrency(bill.amount, currency)}</span>
                  </div>
                  <div className="mt-250 flex flex-wrap items-center gap-200 pl-11 text-xs">
                    {bill.active && (bill.accountId ? (
                      <form action={markBillPaid}>
                        <input type="hidden" name="id" value={bill.id} />
                        <button type="submit" disabled={paidThisMonth} className="font-bold text-green disabled:cursor-not-allowed disabled:text-grey-500">
                          {paidThisMonth ? "Paid this month" : "Mark as paid"}
                        </button>
                      </form>
                    ) : (
                      <button type="button" onClick={() => setEditingBillId(bill.id)} className="font-bold text-red-600 hover:text-red-800">
                        Link account to pay
                      </button>
                    ))}
                    <button type="button" onClick={() => setEditingBillId(editingBillId === bill.id ? null : bill.id)} className="text-grey-500 hover:text-grey-900">Edit</button>
                    <form action={toggleBill}><input type="hidden" name="id" value={bill.id} /><input type="hidden" name="active" value={String(!bill.active)} /><button type="submit" className="text-grey-500 hover:text-grey-900">{bill.active ? "Pause" : "Resume"}</button></form>
                    <form action={deleteBill} onSubmit={(event) => { if (!window.confirm(`Delete ${bill.name}?`)) event.preventDefault(); }}><input type="hidden" name="id" value={bill.id} /><button type="submit" className="text-red-600 hover:text-red-800">Delete</button></form>
                  </div>
                  {editingBillId === bill.id && <div className="mt-300 rounded-xl bg-beige-100 p-300"><BillForm action={editBill} bill={bill} accounts={accounts} categories={categories} onCancel={() => setEditingBillId(null)} /></div>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
