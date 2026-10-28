export type Transaction = {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category: string;
    categoryColor: string;
    account: string;
    notes?: string;
}

export type TransactionOption = {
    id: string;
    name: string;
}

export type TransactionPageData = {
    transactions: Transaction[]
    total: number
    page: number
}

export type TransactionSort = | "latest" | "oldest" | "az" | "za" | "highest" | "lowest";