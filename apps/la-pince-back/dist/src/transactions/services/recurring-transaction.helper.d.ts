import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { RecurringTransactionService } from 'src/lib/bullmq/recurring-transaction/recurring-transaction.service';
import { BudgetService } from 'src/budget/budget.service';
import { UserAccountService } from 'src/user-account/user-account.service';
import { RecurringTransactionResult, DatabaseTransaction } from '../interfaces/transaction-interfaces';
export declare class RecurringTransactionHelper {
    private readonly db;
    private readonly recurringTransactionService;
    private readonly budgetService;
    private readonly userAccountService;
    constructor(db: NodePgDatabase<typeof schema>, recurringTransactionService: RecurringTransactionService, budgetService: BudgetService, userAccountService: UserAccountService);
    getChildTransactionDescription(parentDescription: string | null): string;
    processRecurringTransactions(parentTransaction: schema.Transaction, userId: string, tx?: DatabaseTransaction): Promise<RecurringTransactionResult>;
    storeAndScheduleRecurringTransaction(recurringResult: RecurringTransactionResult, userId: string, isFirstTransaction: boolean, tx?: DatabaseTransaction): Promise<void>;
    convertToRecurring(transaction: schema.Transaction, userId: string, tx: DatabaseTransaction): Promise<any>;
    stopRecurringTransactionLogic(parentId: string, tx: DatabaseTransaction): Promise<void>;
    handleRecurringChildRemoval(transaction: schema.Transaction, recurringParentId: string, tx: DatabaseTransaction): Promise<void>;
}
