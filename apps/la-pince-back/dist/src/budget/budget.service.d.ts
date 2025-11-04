import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { CategoriesService } from 'src/categories/categories.service';
import { BudgetResetService } from 'src/lib/bullmq/budget-reset/budget-reset.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
export declare class BudgetService {
    private readonly db;
    private readonly categoriesService;
    private readonly budgetResetService;
    private readonly notificationsService;
    private readonly transactionsService;
    private readonly i18n;
    constructor(db: NodePgDatabase<typeof schema>, categoriesService: CategoriesService, budgetResetService: BudgetResetService, notificationsService: NotificationsService, transactionsService: TransactionsService, i18n: I18nService<I18nTranslations>);
    create(createBudgetDto: CreateBudgetDto, userId: string): Promise<schema.Budget>;
    findAllByUserId(userId: string): Promise<schema.Budget[]>;
    findOne(id: string, userId: string): Promise<schema.Budget>;
    findOneByCategoryId(categoryId: string, userId: string): Promise<schema.Budget | null>;
    update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string): Promise<schema.Budget>;
    updateActualAmount(categoryId: string, userId: string, type: number, amount: number, transactionDate: string | Date, tx?: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>): Promise<schema.Budget | null>;
    resetActualAmount(id: string): Promise<schema.Budget | null>;
    remove(id: string, userId: string): Promise<void>;
}
