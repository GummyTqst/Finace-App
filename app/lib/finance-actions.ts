"use server";

import { apiFetch } from "./api";
import { revalidatePath } from "next/cache";

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

// Transaction section

export type TransactionActionState = {
  success: boolean;
  error?: string;
}

export async function createTransaction(
  _previousState: TransactionActionState,
  form: FormData
): Promise<TransactionActionState> {
  try {
    await apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify({
        accountId: value(form, "accountId"),
        categoryId: value(form, "categoryId") || undefined,
        type: value(form, "type"),
        description: value(form, "description"),
        amount: value(form, "amount"),
        date: value(form, "date"),
        notes: value(form, "notes") || undefined,
      })
    });

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not create transaction",
    }
  }
}


// Budget section

export async function createBudget(form: FormData) {
  await apiFetch("/budgets", {
    method: "POST",
    body: JSON.stringify({
      name: value(form, "name"),
      amount: value(form, "amount"),
      color: value(form, "color"),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }),
  });
  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function editBudget(form: FormData) {
  await apiFetch("/budgets", {
    method: "PATCH",
    body: JSON.stringify({
      id: String(form.get("id")),
      name: String(form.get("name")),
      amount: String(form.get("amount")),
      color: String(form.get("color")),
    }),
  });

  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function deleteBudget(form: FormData) {
  await apiFetch("/budgets", {
    method: "DELETE",
    body: JSON.stringify({
      id: String(form.get("id")),
    }),
  });

  revalidatePath("/");
  revalidatePath("/budgets");
}

// Pots section

export async function createPot(form: FormData) {
  await apiFetch("/pots", {
    method: "POST",
    body: JSON.stringify({
      name: value(form, "name"),
      targetAmount: value(form, "targetAmount"),
      color: value(form, "color") || "#277c78",
    }),
  });
  revalidatePath("/");
  revalidatePath("/pots");
}

export async function updatePot(form: FormData) {
  await apiFetch("/pots", {
    method: "PATCH",
    body: JSON.stringify({
      id: value(form, "id"),
      action: value(form, "action"),
      amount: value(form, "amount"),
    }),
  });
  revalidatePath("/");
  revalidatePath("/pots");
}

export async function editPot(form: FormData) {
  await apiFetch("/pots", {
    method: "PATCH",
    body: JSON.stringify({
      id: value(form, "id"),
      action: "edit",
      name: value(form, "name"),
      targetAmount: value(form, "targetAmount"),
      color: value(form, "color") || "#277c78",
    }),
  });
  revalidatePath("/");
  revalidatePath("/pots");
}

export async function deletePot(form: FormData) {
  await apiFetch("/pots", {
    method: "DELETE",
    body: JSON.stringify({ id: value(form, "id") }),
  });
  revalidatePath("/");
  revalidatePath("/pots");
}

// Bills section

export async function createBill(form: FormData) {
  await apiFetch("/bills", {
    method: "POST",
    body: JSON.stringify({
      name: value(form, "name"),
      amount: value(form, "amount"),
      dueDay: value(form, "dueDay"),
      category: value(form, "category") || undefined,
      account: value(form, "account") || undefined,
    }),
  });
  revalidatePath("/bills");
}

export async function addMoneyToBalance(form: FormData) {
  await apiFetch("/accounts", {
    method: "PATCH",
    body: JSON.stringify({
      action: "deposit",
      id: value(form, "accountId"), 
      amount: value(form, "amount") 
    }),
  });
  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/pots");
}

// Onboarding section

export async function completeOnboarding(data: {
  account: {
    name: string;
    type: string;
    currency: string;
    openingBalance: number;
  };
  categories: string[];
}) {
  try {
    await apiFetch("/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath("/");
    revalidatePath("/settings");
    revalidatePath("/pots");
    revalidatePath("/transactions");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not complete onboarding",
    };
  }
}

// Account section
export async function createAccount(form: FormData) {
  await apiFetch("/accounts", {
    method: "POST",
    body: JSON.stringify({
      name: value(form, "name"),
      type: value(form, "type"),
      currency: value(form, "currency"),
      balance: value(form, "balance"),
      institution: value(form, "institution") || undefined,
      isLiability: value(form, "isLiability") === "on",
    }),
  })

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/settings");
}

export async function editAccount(form: FormData) {
  await apiFetch("/accounts", {
    method: "PATCH",
    body: JSON.stringify({
      action: "edit",
      id: value(form, "id"),
      name: value(form, "name"),
      type: value(form, "type"),
      currency: value(form, "currency"),
      institution: value(form, "institution") || undefined,
      isLiability: form.get("isLiability") === "on",
    }),
  });

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/settings");
}

export async function deleteAccount(form: FormData) {
  await apiFetch("/accounts", {
    method: "DELETE",
    body: JSON.stringify({
      id: value(form, "id"),
    }),
  });

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/settings");
}