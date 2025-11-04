import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserEntity } from '../decorator/user.decorator';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, user: UserEntity): Promise<{
        transaction: import("../db/schema").Transaction;
        totalUserAccountAmount: number;
    }>;
    findAll(user: UserEntity, limit?: number, offset?: number): Promise<import("./interfaces/transaction-interfaces").PaginatedTransactions>;
    findOne(id: string, user: UserEntity): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        userAccountId: string;
        transactionType: number;
        description: string | null;
        isDeleted: boolean;
        categoryId: string;
        isRecurring: boolean;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null;
        recurringStartDate: Date | null;
        recurringEndDate: Date | null;
        recurringParentId: string | null;
        metadata: Record<string, any>;
        isOrphaned: boolean;
    }>;
    update(id: string, updateTransactionDto: UpdateTransactionDto, user: UserEntity, updateNextChilds?: boolean): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        userAccountId: string;
        transactionType: number;
        description: string | null;
        isDeleted: boolean;
        categoryId: string;
        isRecurring: boolean;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null;
        recurringStartDate: Date | null;
        recurringEndDate: Date | null;
        recurringParentId: string | null;
        metadata: Record<string, any>;
        isOrphaned: boolean;
    }>;
    remove(id: string, user: UserEntity, removeChildren?: boolean): Promise<{
        message: string;
    }>;
    stopRecurringTransaction(id: string, user: UserEntity): Promise<{
        message: string;
    }>;
}
