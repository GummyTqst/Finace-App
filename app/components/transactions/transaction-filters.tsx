"use client"

import { usePathname, useRouter } from "next/navigation";
import { TransactionOption, TransactionSort } from "./types";
import { useEffect, useState } from "react";

type Props = {
    search: string;
    categoryId: string;
    sort: TransactionSort;
    categories: TransactionOption[];
}

export default function TransactionFilters({
    search,
    categoryId,
    sort,
    categories,
}: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const [searchValue, setSearchValue] = useState(search)

    function updateUrl(value: Record<string, string>) {
        const params = new URLSearchParams(window.location.search)

        Object.entries(value).forEach(([key, value]) => {
            if (!value) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        params.set("page", "1")

        router.push(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (searchValue !== search) {
                updateUrl({ search: searchValue })
            }
        }, 350)

        return () => window.clearTimeout(timeout)
    }, [searchValue])

    return (
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-88">
                <span className="sr-only">Search transactions</span>

                <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search transaction" className="field pl-400" />

                <span className="pointer-events-none absolute right-300 top-1/2 -translate-y-1/2 text-grey-500">⌕</span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Sort by</span>

                    <select value={sort} onChange={(event) => updateUrl({ sort: event.target.value })} className="rounded-lg border border-grey-300 bg-white px-300 py-300 text-sm text-grey-900">
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="az">A to Z</option>
                        <option value="za">Z to A</option>
                        <option value="highest">Highest</option>
                        <option value="lowest">Lowest</option>
                    </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Category</span>

                    <select value={categoryId} onChange={(event) => updateUrl({ categoryId: event.target.value })} className="max-w-full rounded-lg border border-grey-300 bg-white px-300 py-300 text-sm text-grey-900">
                        <option value="">All transactions</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    )
}