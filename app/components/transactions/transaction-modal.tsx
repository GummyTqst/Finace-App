"use client";

import { useActionState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import {
  createTransaction,
  type TransactionActionState,
} from "@/lib/finance-actions";
import type { TransactionOption } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  accounts: TransactionOption[];
  categories: TransactionOption[];
};

const initialState: TransactionActionState = {
  success: false,
};

export default function TransactionModal({
  isOpen,
  onClose,
  accounts,
  categories,
}: Props) {
  const [state, formAction, pending] = useActionState(
    createTransaction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add transaction"
      description="Record money coming in or going out."
    >
      <form action={formAction} className="mt-500 space-y-300">
        <label className="block">
          <span className="mb-100 block text-sm font-bold text-grey-900">
            Description
          </span>

          <input
            name="description"
            required
            placeholder="e.g. Grocery shopping"
            className="field pl-300"
          />
        </label>

        <div className="grid grid-cols-1 gap-300 sm:grid-cols-2">
          <label className="block">
            <span className="mb-100 block text-sm font-bold text-grey-900">
              Amount
            </span>

            <input
              name="amount"
              required
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="field pl-300"
            />
          </label>

          <label className="block">
            <span className="mb-100 block text-sm font-bold text-grey-900">
              Type
            </span>

            <select
              name="type"
              defaultValue="expense"
              className="field pl-300"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-300 sm:grid-cols-2">
          <label className="block">
            <span className="mb-100 block text-sm font-bold text-grey-900">
              Date
            </span>

            <input
              name="date"
              type="date"
              required
              defaultValue={new Date()
                .toISOString()
                .slice(0, 10)}
              className="field pl-300"
            />
          </label>

          <label className="block">
            <span className="mb-100 block text-sm font-bold text-grey-900">
              Account
            </span>

            <select
              name="accountId"
              required
              defaultValue=""
              className="field pl-300"
            >
              <option value="" disabled>
                Select account
              </option>

              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-100 block text-sm font-bold text-grey-900">
            Category
          </span>

          <select
            name="categoryId"
            defaultValue=""
            className="field pl-3"
          >
            <option value="">No category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-100 block text-sm font-bold text-grey-900">
            Notes
          </span>

          <textarea
            name="notes"
            placeholder="Optional notes"
            className="field min-h-24 pl-300"
          />
        </label>

        {state.error && (
          <p className="rounded-lg bg-red/10 p-300 text-sm text-red">
            {state.error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-200 pt-200 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={pending}
            className="button disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Adding..." : "Add transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}