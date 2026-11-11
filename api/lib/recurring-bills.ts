type BillSummaryInput = {
  amount: number;
  dueDay: number;
  active: boolean;
  lastPaidDate: Date | null;
};

export function isPaidThisMonth(lastPaidDate: Date | null, now = new Date()) {
  return Boolean(
    lastPaidDate &&
      lastPaidDate.getFullYear() === now.getFullYear() &&
      lastPaidDate.getMonth() === now.getMonth(),
  );
}

export function daysUntilDue(dueDay: number, now = new Date()) {
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return dueDay >= currentDay ? dueDay - currentDay : daysInMonth - currentDay + dueDay;
}

export function summarizeRecurringBills(bills: BillSummaryInput[], now = new Date()) {
  const activeBills = bills.filter((bill) => bill.active);
  const paidBills = activeBills.filter((bill) => isPaidThisMonth(bill.lastPaidDate, now));
  const upcomingBills = activeBills.filter((bill) => !isPaidThisMonth(bill.lastPaidDate, now));
  const dueSoonBills = upcomingBills.filter((bill) => daysUntilDue(bill.dueDay, now) <= 7);
  const total = (items: BillSummaryInput[]) => items.reduce((sum, bill) => sum + bill.amount, 0);

  return {
    paid: total(paidBills),
    upcoming: total(upcomingBills),
    dueSoon: total(dueSoonBills),
  };
}
