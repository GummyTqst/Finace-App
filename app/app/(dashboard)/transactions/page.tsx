import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";

import type {
  TransactionPageData,
  TransactionOption,
  TransactionSort,
} from "@/components/transactions/types";
import TransactionPage from "@/components/transactions/transaction-page";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  categoryId?: string;
  sort?: string;
}>;

function getSafePage(value?: string) {
  const page = Number(value ?? "1");

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

function getSafeSort(value?: string): TransactionSort {
  const validSorts: TransactionSort[] = [
    "latest",
    "oldest",
    "az",
    "za",
    "highest",
    "lowest",
  ];

  return validSorts.includes(value as TransactionSort)
    ? (value as TransactionSort)
    : "latest";
}

export default async function TransactionsRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = getSafePage(params.page);
  const search = params.search ?? "";
  const categoryId = params.categoryId ?? "";
  const sort = getSafeSort(params.sort);

  const query = new URLSearchParams({
    page: String(page),
    limit: "10",
    sort,
  });

  if (search) {
    query.set("search", search);
  }

  if (categoryId) {
    query.set("categoryId", categoryId);
  }

  let data: TransactionPageData;
  let accounts: { accounts: TransactionOption[] };
  let categories: { categories: TransactionOption[] };

  try {
    [data, accounts, categories] = await Promise.all([
      apiFetch<TransactionPageData>(
        `/transactions?${query.toString()}`,
      ),
      apiFetch<{ accounts: TransactionOption[] }>("/accounts"),
      apiFetch<{ categories: TransactionOption[] }>("/categories"),
    ]);
  } catch {
    redirect("/login");
  }

  return (
    <TransactionPage
      data={data}
      accounts={accounts.accounts}
      categories={categories.categories}
      search={search}
      categoryId={categoryId}
      sort={sort}
    />
  );
}