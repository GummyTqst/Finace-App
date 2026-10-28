import { apiFetch } from "@/lib/api";
import { createAccount, deleteAccount, editAccount } from "@/lib/finance-actions";
import { formatCurrency } from "@/lib/format";
import { redirect } from "next/navigation";

type Account = {
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    institution?: string | null;
    isLiability: boolean;
}

export default async function AccountsPage() {
    let data: { accounts: Account[] }

    try {
        data = await apiFetch("/accounts");
    } catch {
        redirect("/login");
    } 

    return (
        <div className="space-y-400">
            <div>
                <h1>
                    Accounts
                </h1>
                <p>
                    Manage your bank accounts and balances.
                </p>
            </div>

            <section>
                <h2>
                    Add account
                </h2>

                <form action={createAccount} className="grid gap-200 md:grid-cols-2">
                    <input name="name" required placeholder="Account name" className="field" />

                    <select name="type" className="field">
                        <option value="checking">Checking account</option>
                        <option value="savings">Savings account</option>
                        <option value="cash">Cash</option>
                        <option value="credit">Credit</option>
                    </select>

                    <input name="institution" placeholder="Bank or institution" className="field" />

                    <select name="currency" className="field">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>

                    <input type="number" name="balance" min="0" step="0.01" placeholder="Opening balance" className="field" />

                    <label className="flex items-center gap-200">
                        <input type="checkbox" name="isLiability" />
                        This is a liability account
                    </label>

                    <button className="button md:col-span-2" type="submit">
                        Add Account
                    </button>
                </form>
            </section>

            <section className="space-y-300">
                {data.accounts.map((account) => (
                <article
                    key={account.id}
                    className="rounded-2xl bg-white p-400"
                >
                    <div className="flex items-start justify-between gap-300">
                    <div>
                        <h2 className="font-bold text-grey-900">
                        {account.name}
                        </h2>

                        <p className="text-sm text-grey-500">
                        {account.type}
                        {account.institution
                            ? ` · ${account.institution}`
                            : ""}
                        </p>
                    </div>

                    <strong className="text-xl text-grey-900">
                        {formatCurrency(account.balance)}
                    </strong>
                    </div>

                    <details className="mt-300">
                    <summary className="cursor-pointer text-sm text-grey-500">
                        Edit account
                    </summary>

                    <form
                        action={editAccount}
                        className="mt-300 grid gap-200 md:grid-cols-2"
                    >
                        <input
                        type="hidden"
                        name="id"
                        value={account.id}
                        />

                        <input
                        name="name"
                        required
                        defaultValue={account.name}
                        className="field"
                        />

                        <select
                        name="type"
                        defaultValue={account.type}
                        className="field"
                        >
                        <option value="checking">Checking account</option>
                        <option value="savings">Savings account</option>
                        <option value="cash">Cash</option>
                        <option value="credit">Credit card</option>
                        </select>

                        <input
                        name="institution"
                        defaultValue={account.institution ?? ""}
                        placeholder="Bank or institution"
                        className="field"
                        />

                        <select
                        name="currency"
                        defaultValue={account.currency}
                        className="field"
                        >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        </select>

                        <button className="button" type="submit">
                        Save Changes
                        </button>
                    </form>
                    </details>

                    <form action={deleteAccount} className="mt-300">
                    <input
                        type="hidden"
                        name="id"
                        value={account.id}
                    />

                    <button
                        className="text-sm text-red"
                        type="submit"
                    >
                        Delete account
                    </button>
                    </form>
                </article>
                ))}
            </section>
        </div>
    )
}