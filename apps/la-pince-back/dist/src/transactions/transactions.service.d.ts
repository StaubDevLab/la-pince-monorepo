import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserAccountService } from 'src/user-account/user-account.service';
import { CategoriesService } from 'src/categories/categories.service';
import { BudgetService } from 'src/budget/budget.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RecurringTransactionHelper } from './services/recurring-transaction.helper';
import { TransactionFinderService } from './services/transaction-finder.service';
import { TransactionUpdateService } from './services/transaction-update.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
export declare class TransactionsService {
    private readonly db;
    private readonly userAccountService;
    private readonly categoriesService;
    private readonly budgetService;
    private readonly notificationsService;
    private readonly recurringTransactionHelper;
    private readonly transactionFinderService;
    private readonly transactionUpdateService;
    private readonly i18n;
    constructor(db: NodePgDatabase<typeof schema>, userAccountService: UserAccountService, categoriesService: CategoriesService, budgetService: BudgetService, notificationsService: NotificationsService, recurringTransactionHelper: RecurringTransactionHelper, transactionFinderService: TransactionFinderService, transactionUpdateService: TransactionUpdateService, i18n: I18nService<I18nTranslations>);
    private getUserAccount;
    create(createTransactionDto: CreateTransactionDto, userId: string): Promise<{
        transaction: schema.Transaction;
        totalUserAccountAmount: number;
    }>;
    createChildTransactions(transactionParentId: string, userId: string): Promise<schema.Transaction>;
    findAll(userId: string, limit?: number, page?: number): Promise<import("./interfaces/transaction-interfaces").PaginatedTransactions>;
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
    update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string, updateNextChilds?: boolean): Promise<schema.Transaction>;
    remove(id: string, userId: string, removeChildren: boolean): Promise<{
        message: string;
    }>;
    stopRecurringTransaction(transactionId: string, userId: string): Promise<{
        message: string;
    }>;
}
