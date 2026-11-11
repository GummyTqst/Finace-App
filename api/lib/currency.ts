const ratesApi = "https://api.frankfurter.dev/v2";

export async function getExchangeRate(from: string, to: string) {
  if (from === to) return 1;

  const response = await fetch(
    `${ratesApi}/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Exchange rate is currently unavailable");
  }

  const data = (await response.json()) as { rate?: number };
  if (!data.rate || !Number.isFinite(data.rate)) {
    throw new Error("Invalid exchange rate");
  }

  return data.rate;
}
