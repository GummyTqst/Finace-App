"use client";

import { useState } from "react";
import { createBudget, deleteBudget, editBudget } from "@/lib/finance-actions";
import Modal from "@/components/ui/modal";
import { ThemeSelect } from "@/components/pots/pot-modals";

type BudgetModalData = {
  id: string;
  name: string;
  color: string;
  amount: number;
};

const categories = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
];

const themes = [
  { name: "Green", value: "#277c78" },
  { name: "Yellow", value: "#f2cdac" },
  { name: "Cyan", value: "#82c9d7" },
  { name: "Navy", value: "#626070" },
  { name: "Red", value: "#c94736" },
  { name: "Purple", value: "#826cb0" },
  { name: "Turquoise", value: "#597c7c" },
  { name: "Orange", value: "#f2c94c" },
];

export default function AddBudgetModal({
  usedCategories,
}: {
  usedCategories: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [themeColor, setThemeColor] = useState("#277c78");

  async function submit(formData: FormData) {
    await createBudget(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button className="button" type="button" onClick={() => setIsOpen(true)}>
        + Add New Budget
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Budget"
        description="Choose a category to set a spending budget. These categories can help you monitor spending."
      >
        <form action={submit} className="mt-500 space-y-300">
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Budget Category
            </span>
            <select name="name" required defaultValue="" className="w-full border rounded-lg border-[#d8d3cf] bg-white text-gray-900 py-[0.7rem] px-[0.75rem] text-[0.875rem]">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => {
                const used = usedCategories.includes(category);
                return (
                  <option key={category} value={category}>
                    {category}{used ? " (already used)" : ""}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Maximum Spend
            </span>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 flex items-center text-grey-500">
                €
              </span>
              <input
                name="amount"
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 2000"
                className="field"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Theme
            </span>
            <div className="relative">
              <select
                name="color"
                value={themeColor}
                onChange={(event) => setThemeColor(event.target.value)}
                className="field appearance-none"
              >
                {themes.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 left-300 flex items-center">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
              </span>
            </div>
          </label>

          <button className="button mt-200 w-full" type="submit">
            Add Budget
          </button>
        </form>
      </Modal>
    </>
  );
}

export function BudgetMenu({
  budget,
}: {
  budget: BudgetModalData;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  
  const defaultColor = themes.some(
    (theme) => theme.value === budget.color,
  )
    ? budget.color
    : themes[0].value;
  
  const [themeColor, setThemeColor] = useState(defaultColor);

  async function submitEdit(formData: FormData) {
    await editBudget(formData);
    setMode(null);
  }

  async function submitDelete(formData: FormData) {
    await deleteBudget(formData);
    setMode(null);
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          aria-label={`More actions for ${budget.name}`}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-8 w-8 text-2xl leading-none text-grey-500"
        >
          …
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 z-10 w-44 rounded-xl bg-white p-200 shadow-xl">
            <button
              type="button"
              className="w-full rounded-lg px-200 py-150 text-left text-sm hover:bg-beige-100"
              onClick={() => {
                setMenuOpen(false);
                setMode("edit");
              }}
            >
              Edit Budget
            </button>

            <div className="my-100 h-px bg-beige-100" />

            <button
              type="button"
              className="w-full rounded-lg px-200 py-150 text-left text-sm text-red hover:bg-red/10"
              onClick={() => {
                setMenuOpen(false);
                setMode("delete");
              }}
            >
              Delete Budget
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={mode === "edit"}
        onClose={() => setMode(null)}
        title="Edit Budget"
        description="Update this budget."
      >
        <form action={submitEdit} className="mt-500 space-y-300">
          <input type="hidden" name="id" value={budget.id} />

          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Budget Category
            </span>

            <select
              name="name"
              defaultValue={budget.name}
              className="field"
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Maximum Spend
            </span>

            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={budget.amount}
              className="field"
            />
          </label>

          <label className="block">

            <ThemeSelect 
              value={themeColor}
              usedColors={[]}
              currentColor={budget.color}
              onChange={setThemeColor}
            />
          </label>

          <button className="button w-full" type="submit">
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={mode === "delete"}
        onClose={() => setMode(null)}
        title={`Delete ‘${budget.name}’?`}
        description="This budget will be permanently deleted."
      >
        <form action={submitDelete} className="mt-500">
          <input type="hidden" name="id" value={budget.id} />

          <button
            className="w-full rounded-lg bg-red px-400 py-400 font-bold text-white"
            type="submit"
          >
            Yes, Confirm Deletion
          </button>

          <button
            className="mt-200 w-full py-200 text-grey-500"
            type="button"
            onClick={() => setMode(null)}
          >
            No, Go Back
          </button>
        </form>
      </Modal>
    </>
  );
}