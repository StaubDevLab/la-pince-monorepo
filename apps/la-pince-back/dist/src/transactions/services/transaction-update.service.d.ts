import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { BudgetService } from 'src/budget/budget.service';
import { DatabaseTransaction } from '../interfaces/transaction-interfaces';
export declare class TransactionUpdateService {
    private readonly db;
    private readonly budgetService;
    constructor(db: NodePgDatabase<typeof schema>, budgetService: BudgetService);
    validateChildTransactionUpdate(transaction: schema.Transaction, updateTransactionDto: UpdateTransactionDto): void;
    handleAmountUpdate(transaction: schema.Transaction, updateTransactionDto: UpdateTransactionDto, userId: string, tx: DatabaseTransaction, updateNextChilds: boolean): Promise<number>;
    handleCategoryUpdate(transaction: schema.Transaction, updateTransactionDto: UpdateTransactionDto, userId: string, tx: DatabaseTransaction): Promise<void>;
}
