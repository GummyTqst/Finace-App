const currencyFormatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
