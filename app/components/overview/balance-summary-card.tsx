"use client"

import { formatCurrency } from "@/lib/format";
import { useMemo, useState } from "react";

type Account = {
    id: string;
    name: string;
    balance: number;
    isLiability: boolean;
}

export default function BalanceSummaryCard({
    accounts,
    totalBalance,
}: {
    accounts: Account[];
    totalBalance: number;
}) {
    const [selectedAccountId, setSelectedAccountId] = useState("all")

    const displayedBalance = useMemo(() => {
        if (selectedAccountId === "all") {
            return totalBalance
        }

        const selectedAccount = accounts.find(
            (account) => account.id === selectedAccountId
        )

        return selectedAccount?.balance ?? 0
    }, [selectedAccountId, accounts, totalBalance])

    return (
        <div className="rounded-2xl bg-grey-900 p-400 text-white">
            <div className="flex items-start justify-between gap-200">
                <p>Total Balance</p>

                <select value={selectedAccountId} onChange={(event) => setSelectedAccountId(event.target.value)} className="rounded-lg border border-gray-500 bg-grey-900 px-200 py-100 text-sm text-white" aria-label="Choose account for balance">
                    <option value="all">All accounts</option>

                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>

            <p className="mt-200">
                {formatCurrency(displayedBalance)}
            </p>
        </div>
    )
}