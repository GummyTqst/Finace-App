export function formatCurrency(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
  }).format(value);
}
