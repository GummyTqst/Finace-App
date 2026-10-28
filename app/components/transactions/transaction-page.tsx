"use client"

import { useState } from "react";
import { TransactionOption, TransactionPageData, TransactionSort } from "./types"
import TransactionFilters from "./transaction-filters";
import TransactionTable from "./transaction-table";
import TransactionMobileList from "./transaction-mobile-list";
import TransactionPagination from "./transaction-pagination";
import TransactionModal from "./transaction-modal";

type Props = {
    data: TransactionPageData;
    accounts: TransactionOption[]
    categories: TransactionOption[]
    search: string
    categoryId: string
    sort: TransactionSort;
}

export default function TransactionPage({
    data,
    accounts,
    categories,
    search,
    categoryId,
    sort,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="space-y-5">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-grey-900">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-grey-500">
                            Keep track of money coming in and going out
                        </p>
                    </div>

                    <button type="button" onClick={() => setIsModalOpen(true)} className="button w-full sm:w-auto">
                        + Add transaction
                    </button>
                </header>

                <section className="rounded-2xl bg-white p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-grey-900">
                            All transaction
                        </h2>

                        <span className="text-sm text-grey-500">
                            {data.total} total
                        </span>
                    </div>

                    <TransactionFilters 
                        search={search} 
                        categoryId={categoryId} 
                        sort={sort} 
                        categories={categories}
                    />

                    {data.transactions.length === 0 ? (
                        <div className="rounded-xl bg-beige-100 px-4 py-8 text-center">
                            <p className="font-bold text-grey-900">
                                No transactions found
                            </p>

                            <p className="mt-1 text-sm text-grey-500">
                                Try changin your search or filter
                            </p>
                        </div>
                    ) : (
                        <>
                            <TransactionTable transactions={data.transactions} />

                            <TransactionMobileList transactions={data.transactions} />

                            <TransactionPagination page={data.page} total={data.total} pageSize={10} />
                        </>
                    )}
                </section>
            </div>

            {isModalOpen && (
                <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} accounts={accounts} categories={categories} />
            )}
        </>
    )
}