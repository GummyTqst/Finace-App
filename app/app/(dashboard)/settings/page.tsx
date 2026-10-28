import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { addMoneyToBalance } from "@/lib/finance-actions";
import { redirect } from "next/navigation";
import SettingsTab from "@/components/settings/settings-tabs";

type SettingsData = {
  user: {
    name: string;
    email: string;
    currency: string;
    active: boolean;
  };
};

type SettingsAccount = {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export default async function SettingsPage() {
  let data: SettingsData;
  let balance = 0;
  let accounts: SettingsAccount[] = [];

  try {
    data = await apiFetch<SettingsData>("/users/me");
    
    const accountsResponse = await apiFetch<{
      accounts: SettingsAccount[];
    }>("/accounts")

    accounts = accountsResponse.accounts;

    balance = accounts
      .filter((account) => account.type !== "credit")
      .reduce((sum, account) => sum + account.balance, 0);
  } catch {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl space-y-400">
      <div>
        <h1 className="text-2xl font-bold text-grey-900">Settings</h1>
        <p className="text-sm text-grey-500">Manage your account and balance.</p>
      </div>

      <SettingsTab
        tabs={[
          {
            id: "profile",
            label: "Profile",
            content: (
              <div>
                <div className="rounded-xl bg-grey-100 p-300">
                  <h2 className="font-bold text-grey-900">
                    Account details
                  </h2>
                  <p className="mt-100 text-sm text-grey-500">
                    Your personal account information.
                  </p>
                </div>

                <dl className="mt-400 grid gap-300 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-grey-500">Name</dt>
                    <dd className="mt-100 font-medium text-grey-900">
                      {data.user.name}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-grey-500">Email</dt>
                    <dd className="mt-100 font-medium text-grey-900">
                      {data.user.email}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-grey-500">Currency</dt>
                    <dd className="mt-100 font-medium text-grey-900">
                      {data.user.currency}
                    </dd>
                  </div>
                </dl>
              </div>
            ),
          },

          {
            id: "finances",
            label: "Finances",
            content: (
              <div>
                <div className="flex items-start justify-between gap-300 rounded-xl bg-grey-100 p-300">
                  <div>
                    <h2 className="font-bold text-grey-900">
                      Total balance
                    </h2>
                    <p className="mt-100 text-sm text-grey-500">
                      Available across your accounts.
                    </p>
                  </div>

                  <strong className="text-xl text-grey-900">
                    {formatCurrency(balance)}
                  </strong>
                </div>

                <form
                  action={addMoneyToBalance}
                  className="mt-400 flex flex-col gap-200 sm:flex-row"
                >
                  <select
                    name="accountId"
                    required
                    className="field"
                    defaultValue={accounts[0]?.id ?? ""}
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

                  <input
                    name="amount"
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Amount to add"
                    className="field pl-800"
                  />

                  <button className="button" type="submit">
                    Add money
                  </button>
                </form>
              </div>
            ),
          },

          {
            id: "security",
            label: "Security",
            content: (
              <div className="rounded-xl bg-grey-100 p-300">
                <h2 className="font-bold text-grey-900">
                  Security
                </h2>
                <p className="mt-100 text-sm text-grey-500">
                  Password and authentication settings will go here.
                </p>
              </div>
            ),
          },

          {
            id: "danger",
            label: "Danger zone",
            content: (
              <div className="rounded-xl border border-red-200 bg-red-50 p-300">
                <h2 className="font-bold text-red-900">
                  Delete account
                </h2>
                <p className="mt-100 text-sm text-red-700">
                  Permanently delete your account and all associated data.
                </p>

                <button
                  type="button"
                  className="mt-300 rounded-lg bg-red-600 px-300 py-200 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete account
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
