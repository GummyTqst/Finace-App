"use client"

import { useTable } from "@tanstack/react-table"
import { Transaction } from "./types"
import { transactionColumns, transactionFeatures } from "./transaction-columns"

type Props = {
    transactions: Transaction[]
}

export default function TransactionTable({
    transactions,
}: Props) {
    const table = useTable({
        features: transactionFeatures,
        columns: transactionColumns,
        data: transactions,
    })

    return (
        <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b border-grey-100"> 
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-2 py-3 text-left text-xs font-normal text-grey-500 last:text-right">
                                    {header.isPlaceholder ? null : (
                                        <table.FlexRender header={header} />
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b border-grey-100 last:border-0">
                            {row.getAllCells().map((cell) => (
                                <td key={cell.id} className="px-2 py-3 last:text-right">
                                    <table.FlexRender cell={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}