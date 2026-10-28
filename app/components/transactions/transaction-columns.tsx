import {
    createColumnHelper,
    tableFeatures,
} from "@tanstack/react-table";
  
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "./types";
  
export const transactionFeatures = tableFeatures({});
  
const columnHelper = createColumnHelper<
    typeof transactionFeatures,
    Transaction
>();
  
export const transactionColumns = columnHelper.columns([
    columnHelper.accessor("description", {
        header: "Recipient / Sender",
    
        cell: (info) => {
            const transaction = info.row.original;
    
            return (
                <div className="flex min-w-0 items-center gap-300">
                    <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                    style={{
                        backgroundColor: transaction.categoryColor,
                    }}
                    >
                    {transaction.description.charAt(0).toUpperCase()}
                    </span>
        
                    <span className="truncate font-bold text-grey-900">
                    {transaction.description}
                    </span>
                </div>
            );
        },
    }),
  
    columnHelper.accessor("category", {
        header: "Category",
    
        cell: (info) => (
            <span className="text-sm text-grey-500">
                {info.getValue()}
            </span>
        ),
    }),
  
    columnHelper.accessor("account", {
        header: "Account",
    
        cell: (info) => (
            <span className="text-sm text-grey-500">
                {info.getValue()}
            </span>
        ),
    }),
  
    columnHelper.accessor("date", {
        header: "Transaction date",
    
        cell: (info) => (
            <span className="text-sm text-grey-500">
                {new Date(info.getValue()).toLocaleDateString("da-DK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </span>
        ),
    }),
  
    columnHelper.accessor("amount", {
        header: "Amount",
    
        cell: (info) => {
            const transaction = info.row.original;
            const isIncome = transaction.type === "income";
    
            return (
                <span
                    className={`whitespace-nowrap text-right font-bold ${
                    isIncome ? "text-green" : "text-grey-900"
                    }`}
                >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(info.getValue())}
                </span>
            );
        },
    }),
  ]);