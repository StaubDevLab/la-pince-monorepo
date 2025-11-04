import * as schema from 'src/db/schema';
export interface RecurringTransactionResult {
    lastTransactionDate: Date;
    lastTransactionId: string;
    transaction: schema.Transaction;
}
export type DatabaseTransaction = any;
export interface PaginatedTransactions {
    data: schema.Transaction[];
    limit: number;
    page: number;
    total: number;
    lastPage: number;
}
