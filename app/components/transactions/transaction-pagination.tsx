"use client"

import { usePathname, useRouter } from "next/navigation";

type Props = {
    page: number;
    total: number;
    pageSize: number;
}

export default function TransactionPagination({
    page,
    total,
    pageSize,
}: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const pageCount = Math.max(1, Math.ceil(total / pageSize))

    function goToPage(nextPage: number) {
        const params = new URLSearchParams(window.location.search)
        params.set("page", nextPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    if (total === 0) {
        return null
    }

    return (
        <div className="mt-5 flex items-center justify-between gap-3">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="button-secondary border border-grey-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
                ← <span className="hidden sm:inline">Prev</span>
            </button>

            <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }).map((_, index) => {
                    const pageNumber = index + 1

                    if (
                        pageCount > 7 &&
                        pageNumber > 3 &&
                        pageNumber < pageCount - 2 
                    ) {
                        if (pageNumber === 4) {
                            return (
                                <span key="ellipsis" className="px-1 text-grey-500">...</span>
                            )
                        }

                        return null
                    }

                    return (
                        <button
                            key={pageNumber}
                            type="button"
                            onClick={() => goToPage(pageNumber)}
                            className={`grid h-10 min-w-10 place-items-center rounded-lg border border-grey-300 px-3 text-sm ${page === pageNumber ? "bg-grey-900 text-white" : "bg-white text-grey-900"}`}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => goToPage(page + 1)}
                className="button-secondary border border-grey-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="hidden sm:inline">Next</span> →
            </button>
        </div>
    )
}