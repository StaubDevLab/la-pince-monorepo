import { Queue } from "bullmq";
import * as schema from "../../../db/schema";
export declare class RecurringTransactionService {
    private queue;
    private readonly logger;
    constructor(queue: Queue);
    scheduleRecurringTransaction(transaction: schema.Transaction, userId: string, isParent?: boolean): Promise<void>;
    private calculateNextTransactionDelay;
    cancelRecurringTransaction(transactionId: string): Promise<void>;
}
