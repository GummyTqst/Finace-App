"use client"

import { completeOnboarding } from "@/lib/finance-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const defaultCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Dining Out",
    "Shopping",
    "Personal Care",
    "Salary",
];

const steps = [
    { id: 1, name: "Account Details" },
    { id: 2, name: "Categories" },
    { id: 3, name: "Review" },
]

export default function OnboardingForm() {
    const router = useRouter()

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const [accountName, setAccountName] = useState("Main account")
    const [accountType, setAccountType] = useState("checking")
    const [currency, setCurrency] = useState("EUR")
    const [openingBalance, setOpeningBalance] = useState("")

    const [categories, setCategories] = useState(defaultCategories);

    function toggleCategory(category: string) {
        setCategories((current) =>
          current.includes(category)
            ? current.filter((item) => item !== category)
            : [...current, category],
        );
    }

    async function finishOnboarding() {
        if (loading) return;
      
        setLoading(true);
        setError("");
      
        try {
            const result = await completeOnboarding({
                account: {
                    name: accountName,
                    type: accountType,
                    currency,
                    openingBalance: Number(openingBalance || 0),
                },
                categories,
            });
      
            if (!result.success) {
                setError(result.error || "");
                return;
            }
      
            router.replace("/");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
      }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 p-8">

                <nav className="mb-8" aria-label="Progress">
                    <ol className="flex items-center justify-between text-sm font-medium text-slate-500">
                        {steps.map((s, idx) => {
                            const isCurrent = step === s.id
                            const isCompleted = step > s.id

                            return (
                                <li key={s.id} className="flex items-center space-x-2">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-colors ${
                                            isCurrent
                                                ? "bg-indigo-600 text-white"
                                                : isCompleted
                                                ? "bg-indigo-100 text-indigo-700"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {isCompleted ? "✓" : s.id}
                                    </span>
                                    <span className={`hidden sm:inline ${isCurrent ? "font-bold text-slate-900" : ""}`}>
                                        {s.name}
                                    </span>
                                    {idx < steps.length - 1 && (
                                        <div className="w-8 sm:w-12 h-0.5 bg-slate-200 mx-2" />
                                    )}
                                </li>
                            )
                        })}
                    </ol>
                </nav>

                {step === 1 && (
                    <section>
                        <h1>Create your first account</h1>
                        <p>This account will be used for your total balance.</p>

                        <input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Account name" />
                        
                        <select value={accountType} onChange={(event) => setAccountType(event.target.value)}>
                            <option value="checking">Checking account</option>
                            <option value="savings">Savings account</option>
                            <option value="cash">Cash</option>
                        </select>

                        <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                        </select>

                        <input type="number" min="0" step="0.01" value={openingBalance} onChange={(event) => setOpeningBalance(event.target.value)} placeholder="Opening balance" />

                        <button type="button" onClick={() => setStep(2)}>Continue</button>
                    </section>
                )}

                {step === 2 && (
                    <section>
                        <h1>Choose your categories</h1>
                        <p>You can change these later.</p>

                        <div>
                            {defaultCategories.map((category) => {
                                const selected = categories.includes(category);

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => toggleCategory(category)}
                                    >
                                        {selected ? "✓" : ""} 
                                        {category}
                                    </button>
                                )
                            })}
                        </div>

                        <button type="button" onClick={() => setStep(1)}>
                            Back
                        </button>

                        <button type="button" onClick={() => setStep(3)}>
                            Continue
                        </button>
                    </section>
                )}

                {step === 3 && (
                    <section>
                        <h1>Your account is ready</h1>

                        <p>Account: {accountName}</p>
                        <p>Currency: {currency}</p>
                        <p>Opening balance: {openingBalance || "0.00"}</p>
                        <p>Categories selected: {categories.length}</p>

                        {error && (
                            <p role="alert" className="mt-300 text-sm text-red">
                                {error}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={finishOnboarding}
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Go to dashboard"}
                        </button>
                    </section>
                )}
            </div>
        </main>
    )
}