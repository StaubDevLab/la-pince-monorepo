import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { RecurringTransactionService } from "./recurring-transaction.service";
import { TransactionsService } from "src/transactions/transactions.service";
export declare class RecurringTransactionProcessor extends WorkerHost {
    private recurringTransactionService;
    private transactionsService;
    constructor(recurringTransactionService: RecurringTransactionService, transactionsService: TransactionsService);
    process(job: Job<{
        transactionParentId: string;
        userId: string;
    }>): Promise<void>;
}
