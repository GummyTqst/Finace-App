"use client";

import { useCallback, useState } from "react";

import Modal from "@/components/ui/modal";
import { createPot, deletePot, editPot, updatePot } from "@/lib/finance-actions";
import { formatCurrency } from "@/lib/format";

export type PotModalData = {
  id: string;
  name: string;
  targetAmount: number;
  saved: number;
  color: string;
};

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

function firstAvailableColor(usedColors: string[], currentColor?: string) {
  return (
    themes.find(
      (theme) => theme.value === currentColor || !usedColors.includes(theme.value),
    )?.value ?? themes[0].value
  );
}

export function AddPotModal({ usedColors }: { usedColors: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [themeColor, setThemeColor] = useState(() => firstAvailableColor(usedColors));

  async function submit(formData: FormData) {
    await createPot(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button className="button" type="button" onClick={() => setIsOpen(true)}>
        + Add New Pot
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Pot"
        description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
      >
        <form action={submit} className="mt-500 space-y-300">
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Pot Name
            </span>
            <input
              name="name"
              required
              maxLength={60}
              placeholder="e.g. Rainy Days"
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Target
            </span>
            <CurrencyInput name="targetAmount" placeholder="e.g. 2000" />
          </label>
          <ThemeSelect
            value={themeColor}
            usedColors={usedColors}
            onChange={setThemeColor}
          />
          <button className="button mt-200 w-full" type="submit">
            Add Pot
          </button>
        </form>
      </Modal>
    </>
  );
}

export function PotMenu({
  pot,
  usedColors,
}: {
  pot: PotModalData;
  usedColors: string[];
}) {
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeColor, setThemeColor] = useState(pot.color);

  const close = useCallback(() => {
    setMode(null);
  }, []);

  async function submitEdit(formData: FormData) {
    await editPot(formData);
    close();
  }

  async function submitDelete(formData: FormData) {
    await deletePot(formData);
    close();
  }

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label={`More actions for ${pot.name}`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-8 w-8 text-2xl leading-none text-grey-500"
        >
          <span aria-hidden="true" className="-mt-2 hover:bg-beige-100 hover:text-grey-900 rounded-full">…</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-10 w-44 rounded-xl bg-white p-200 shadow-xl">
            <button
              type="button"
              className="w-full rounded-lg px-200 py-150 text-left text-sm text-grey-900 hover:bg-beige-100"
              onClick={() => {
                setMenuOpen(false);
                setMode("edit");
              }}
            >
              Edit Pot
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
              Delete Pot
            </button>
          </div>
        )}
      </div>
      <Modal
        isOpen={mode === "edit"}
        onClose={close}
        title="Edit Pot"
        description="Update the details of this savings pot."
      >
        <form action={submitEdit} className="mt-500 space-y-300">
          <input type="hidden" name="id" value={pot.id} />
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">Pot Name</span>
            <input name="name" required maxLength={60} defaultValue={pot.name} className="field" />
          </label>
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">Target</span>
            <CurrencyInput name="targetAmount" placeholder="e.g. 2000" defaultValue={pot.targetAmount.toString()} />
          </label>
          <ThemeSelect
            value={themeColor}
            usedColors={usedColors}
            currentColor={pot.color}
            onChange={setThemeColor}
          />
          <button className="button mt-200 w-full" type="submit">Save Changes</button>
        </form>
      </Modal>
      <Modal
        isOpen={mode === "delete"}
        onClose={close}
        title={`Delete ‘${pot.name}’?`}
        description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
        maxWidthClassName="max-w-[46rem]"
      >
        <form action={submitDelete} className="mt-500">
          <input type="hidden" name="id" value={pot.id} />
          <button className="w-full rounded-lg bg-red px-400 py-400 font-bold text-white hover:bg-red/90" type="submit">
            Yes, Confirm Deletion
          </button>
          <button className="mt-200 w-full py-200 text-grey-500 hover:text-grey-900" type="button" onClick={close}>
            No, Go Back
          </button>
        </form>
      </Modal>
    </>
  );
}

export function ThemeSelect({
  value,
  usedColors,
  currentColor,
  onChange,
}: {
  value: string;
  usedColors: string[];
  currentColor?: string;
  onChange?: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTheme = themes.find((theme) => theme.value === value) ?? themes[0];

  return (
    <label className="block">
      <span className="mb-100 block text-xs font-bold text-grey-500">Theme</span>
      <input type="hidden" name="color" value={value} />
      <div className="relative">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-grey-900 bg-white px-300 py-250 text-left text-grey-900"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="flex items-center gap-200">
            <span className="h-5 w-5 rounded-full" style={{ backgroundColor: selectedTheme.value }} />
            <span>{selectedTheme.name}</span>
          </span>
          <span className="text-lg leading-none">{isOpen ? "⌃" : "⌄"}</span>
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-100 max-h-64 overflow-y-auto rounded-lg border border-grey-900 bg-white p-150 shadow-xl">
            {themes.map((theme) => {
              const isCurrent = theme.value === value;
              const isUsed = usedColors.includes(theme.value) && theme.value !== currentColor;
              return (
                <button
                  key={theme.value}
                  type="button"
                  disabled={isUsed}
                  className={`flex w-full items-center justify-between rounded-md px-200 py-200 text-left ${
                    isUsed
                      ? "cursor-not-allowed text-grey-300"
                      : "text-grey-900 hover:bg-beige-100"
                  }`}
                  onClick={() => {
                    if (isUsed) return;
                    onChange?.(theme.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="flex items-center gap-200">
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: isUsed ? "#f2f2f2" : theme.value }}
                    />
                    <span>{theme.name}</span>
                  </span>
                  {isUsed ? (
                    <span className="text-sm text-grey-500">Already used</span>
                  ) : isCurrent ? (
                    <span className="grid place-items-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM10.8538 6.85375L7.35375 10.3538C7.30732 10.4002 7.25217 10.4371 7.19147 10.4623C7.13077 10.4874 7.06571 10.5004 7 10.5004C6.9343 10.5004 6.86923 10.4874 6.80853 10.4623C6.74783 10.4371 6.69269 10.4002 6.64625 10.3538L5.14625 8.85375C5.05243 8.75993 4.99972 8.63268 4.99972 8.5C4.99972 8.36732 5.05243 8.24007 5.14625 8.14625C5.24007 8.05243 5.36732 7.99972 5.5 7.99972C5.63268 7.99972 5.75993 8.05243 5.85375 8.14625L7 9.29313L10.1463 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3693 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6915 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375Z" fill="#201F24"/>
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </label>
  );
}

export function PotActions({ pot }: { pot: PotModalData }) {
  const [mode, setMode] = useState<"add" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const action = mode ?? "add";
  const parsedAmount = Number(amount) || 0;
  const currentPercentage = pot.targetAmount ? Math.max(0, Math.min((pot.saved / pot.targetAmount) * 100, 100)) : 0
  const projectedSaved =
    action === "add" ? pot.saved + parsedAmount : Math.max(pot.saved - parsedAmount, 0);
  const percentage = pot.targetAmount
    ? Math.max(0, Math.min((projectedSaved / pot.targetAmount) * 100, 100))
    : 0;

  const close = useCallback(() => {
    setMode(null);
    setAmount("");
  }, []);

  async function submit(formData: FormData) {
    await updatePot(formData);
    close();
  }

  const isAdding = action === "add";
  const changedPercentage = Math.abs(percentage - currentPercentage)

  const basePercentage = isAdding ? currentPercentage : percentage;
  const changeColor = isAdding ? "#277c78" : "#c94736";

  const remainingToTarget = Math.max(pot.targetAmount - pot.saved, 0);
  const canAddMoney = remainingToTarget > 0;
  return (
    <>
      <div className="mt-300 grid grid-cols-2 gap-200">
        <button
          className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={!canAddMoney}
          onClick={() => setMode("add")}
        >
          + Add Money
        </button>
        <button
          className="button-secondary"
          type="button"
          onClick={() => setMode("withdraw")}
        >
          Withdraw
        </button>
      </div>
      <Modal
        isOpen={mode === "add" || mode === "withdraw"}
        onClose={close}
        title={`${isAdding ? "Add to" : "Withdraw from"} ‘${pot.name}’`}
        description={
          isAdding
            ? "Add money to this pot to keep building towards your savings target."
            : "Withdraw money from this pot. Your savings progress will update when you confirm."
        }
        maxWidthClassName="max-w-[46rem]"
      >
        <form action={submit} className="mt-600 space-y-500">
          <input type="hidden" name="id" value={pot.id} />
          <input type="hidden" name="action" value={action} />
          <section>
            <div className="flex items-end justify-between gap-300">
              <span className="text-sm text-grey-500">New Amount</span>
              <strong className="text-3xl text-grey-900">
                {formatCurrency(projectedSaved)}
              </strong>
            </div>
            <div className="mt-300 flex gap-0.5 h-2 overflow-hidden rounded-full bg-beige-100">
              <div
                className="h-full rounded-l-full"
                style={{ width: `${basePercentage}%`, backgroundColor: "#201f24" }}
              />
              <div
                className="h-full rounded-r-full"
                style={{
                  width: `${changedPercentage}%`,
                  backgroundColor: changeColor,
                }}
              />
            </div>
            <div className="mt-150 flex justify-between text-sm">
              <span className="text-green">
                {Math.round(percentage * 100) / 100}%
              </span>
              <span className="text-grey-500">
                Target of {formatCurrency(pot.targetAmount)}
              </span>
            </div>
          </section>
          <label className="block">
            <span className="mb-100 block text-xs font-bold text-grey-500">
              Amount to {isAdding ? "Add" : "Withdraw"}
            </span>
            <CurrencyInput
              name="amount"
              value={amount}
              onChange={setAmount}
              max={isAdding ? remainingToTarget : pot.saved}
              placeholder="0.00"
            />
          </label>
          <button className="button w-full" type="submit">
            Confirm {isAdding ? "Addition" : "Withdrawal"}
          </button>
        </form>
      </Modal>
    </>
  );
}

function CurrencyInput({
  name,
  placeholder,
  value,
  onChange,
  max,
  defaultValue,
}: {
  name: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  max?: number;
  defaultValue?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-300 flex items-center text-grey-500">
        €
      </span>
      <input
        name={name}
        required
        type="number"
        min="0.01"
        max={max}
        step="0.01"
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="field pl-800"
      />
    </div>
  );
}
