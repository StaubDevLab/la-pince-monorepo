import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { PaginatedTransactions } from '../interfaces/transaction-interfaces';
import { UserAccountService } from 'src/user-account/user-account.service';
export declare class TransactionFinderService {
    private readonly db;
    private readonly userAccountService;
    constructor(db: NodePgDatabase<typeof schema>, userAccountService: UserAccountService);
    private getUserAccount;
    findAll(userId: string, limit?: number, page?: number): Promise<PaginatedTransactions>;
    findAllByCategoryId(categoryId: string, userId: string, startDate?: Date): Promise<{
        id: string;
        userAccountId: string;
        amount: number;
        transactionType: number;
        date: Date;
        description: string | null;
        categoryId: string;
        isRecurring: boolean;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null;
        recurringStartDate: Date | null;
        recurringEndDate: Date | null;
        recurringParentId: string | null;
        metadata: Record<string, any>;
        isDeleted: boolean;
        isOrphaned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, userId: string): Promise<schema.Transaction>;
}
