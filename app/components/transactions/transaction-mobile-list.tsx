"use client"

import { formatCurrency } from "@/lib/format"
import { Transaction } from "./types"

type Props = {
    transactions: Transaction[]
}

export default function TransactionMobileList({
    transactions,
}: Props) {
    return (
        <div className="divide-y divide-grey-100 lg:hidden">
            {transactions.map((transaction) => {
                const isIncome = transaction.type === "income"

                return (
                    <div key={transaction.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex min-w-0 items-center gap-300">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: transaction.categoryColor }}>
                                {transaction.description.charAt(0).toUpperCase()}
                            </span>

                            <div className="min-w-0">
                                <p className="truncate font-bold text-grey-900">{transaction.description}</p>
                                <p className="truncate text-xs text-grey-500">
                                    {transaction.category} ·{" "}
                                    {new Date(transaction.date).toLocaleDateString("da-DK")}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <p
                                className={`text-sm font-bold ${
                                isIncome ? "text-green" : "text-grey-900"
                                }`}
                            >
                                {isIncome ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                            </p>

                            <p className="max-w-24 truncate text-xs text-grey-500">{transaction.account}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}