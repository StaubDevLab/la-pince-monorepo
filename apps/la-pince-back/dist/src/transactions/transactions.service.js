"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const user_account_service_1 = require("../user-account/user-account.service");
const categories_service_1 = require("../categories/categories.service");
const budget_service_1 = require("../budget/budget.service");
const notifications_service_1 = require("../notifications/notifications.service");
const recurring_transaction_helper_1 = require("./services/recurring-transaction.helper");
const transaction_finder_service_1 = require("./services/transaction-finder.service");
const transaction_update_service_1 = require("./services/transaction-update.service");
const nestjs_i18n_1 = require("nestjs-i18n");
let TransactionsService = class TransactionsService {
    constructor(db, userAccountService, categoriesService, budgetService, notificationsService, recurringTransactionHelper, transactionFinderService, transactionUpdateService, i18n) {
        this.db = db;
        this.userAccountService = userAccountService;
        this.categoriesService = categoriesService;
        this.budgetService = budgetService;
        this.notificationsService = notificationsService;
        this.recurringTransactionHelper = recurringTransactionHelper;
        this.transactionFinderService = transactionFinderService;
        this.transactionUpdateService = transactionUpdateService;
        this.i18n = i18n;
    }
    async getUserAccount(userId) {
        const userAccount = await this.userAccountService.findOneByUserId(userId);
        if (!userAccount) {
            throw new common_1.NotFoundException('User account not found');
        }
        return userAccount;
    }
    async create(createTransactionDto, userId) {
        const userAccount = await this.getUserAccount(userId);
        return this.db.transaction(async (tx) => {
            await this.categoriesService.findOne(createTransactionDto.categoryId, userId);
            const result = await tx.insert(schema.transactions).values({
                ...createTransactionDto,
                date: new Date(createTransactionDto.date),
                recurringStartDate: createTransactionDto.date ? new Date(createTransactionDto.date) : null,
                recurringEndDate: createTransactionDto.recurringEndDate ? new Date(createTransactionDto.recurringEndDate) : null,
                userAccountId: userAccount.id,
                createdAt: new Date(),
            }).returning();
            await this.budgetService.updateActualAmount(createTransactionDto.categoryId, userId, createTransactionDto.transactionType, createTransactionDto.amount, createTransactionDto.date, tx);
            let userAccountChange = await this.userAccountService.updateTotalAmount(userId, createTransactionDto.transactionType, createTransactionDto.amount);
            if (createTransactionDto.isRecurring) {
                const recurringResult = await this.recurringTransactionHelper.processRecurringTransactions(result[0], userId, tx);
                await this.recurringTransactionHelper.storeAndScheduleRecurringTransaction({
                    transaction: result[0],
                    lastTransactionDate: recurringResult.lastTransactionDate,
                    lastTransactionId: recurringResult.lastTransactionId
                }, userId, recurringResult.lastTransactionId === result[0].id, tx);
                if (recurringResult.lastTransactionId !== result[0].id) {
                    userAccountChange = await this.userAccountService.findOneByUserId(userId);
                }
            }
            return {
                transaction: result[0],
                totalUserAccountAmount: userAccountChange.amount,
            };
        });
    }
    async createChildTransactions(transactionParentId, userId) {
        const parentTransaction = await this.findOne(transactionParentId, userId);
        return this.db.transaction(async (tx) => {
            await this.categoriesService.findOne(parentTransaction.categoryId, userId);
            const description = this.recurringTransactionHelper.getChildTransactionDescription(parentTransaction.description);
            const childTransaction = await tx.insert(schema.transactions).values({
                ...parentTransaction,
                id: undefined,
                description,
                recurringParentId: parentTransaction.id,
                date: new Date(),
                createdAt: new Date(),
            }).returning();
            await tx.update(schema.transactionRecurringInfo)
                .set({
                lastTransactionDate: childTransaction[0].date,
                lastTransactionId: childTransaction[0].id,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.transactionParentId, parentTransaction.id));
            await this.budgetService.updateActualAmount(parentTransaction.categoryId, userId, parentTransaction.transactionType, parentTransaction.amount, childTransaction[0].date, tx);
            await this.userAccountService.updateTotalAmount(userId, parentTransaction.transactionType, parentTransaction.amount);
            await this.notificationsService.create({
                message: this.i18n.t('common.TRANSACTIONS.CHILDREN.created', { args: { description }, lang: nestjs_i18n_1.I18nContext.current()?.lang || 'en' }),
                type: 'transaction',
                level: 'info',
            }, userId);
            return childTransaction[0];
        });
    }
    async findAll(userId, limit = 10, page = 0) {
        return this.transactionFinderService.findAll(userId, limit, page);
    }
    async findAllByCategoryId(categoryId, userId, startDate) {
        return this.transactionFinderService.findAllByCategoryId(categoryId, userId, startDate);
    }
    async findOne(id, userId) {
        return this.transactionFinderService.findOne(id, userId);
    }
    async update(id, updateTransactionDto, userId, updateNextChilds = false) {
        await this.getUserAccount(userId);
        const transaction = await this.findOne(id, userId);
        if (updateTransactionDto.categoryId) {
            await this.categoriesService.findOne(updateTransactionDto.categoryId, userId);
        }
        this.transactionUpdateService.validateChildTransactionUpdate(transaction, updateTransactionDto);
        return this.db.transaction(async (tx) => {
            const result = await tx
                .update(schema.transactions)
                .set({
                amount: updateTransactionDto.amount ?? transaction.amount,
                transactionType: updateTransactionDto.transactionType ?? transaction.transactionType,
                description: updateTransactionDto.description ?? transaction.description,
                categoryId: updateTransactionDto.categoryId ?? transaction.categoryId,
                date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : transaction.date,
                updatedAt: new Date(),
                isRecurring: updateTransactionDto.isRecurring ?? transaction.isRecurring,
                recurringFrequency: updateTransactionDto.recurringFrequency ?? transaction.recurringFrequency,
            })
                .where((0, drizzle_orm_1.eq)(schema.transactions.id, id))
                .returning();
            let userAccountChange;
            let totalAmountDiff = 0;
            if (updateTransactionDto.isRecurring && !transaction.isRecurring) {
                userAccountChange = await this.recurringTransactionHelper.convertToRecurring(result[0], userId, tx);
            }
            if (updateTransactionDto.amount) {
                totalAmountDiff = await this.transactionUpdateService.handleAmountUpdate(transaction, updateTransactionDto, userId, tx, updateNextChilds);
            }
            if (updateTransactionDto.categoryId && (updateTransactionDto.categoryId !== transaction.categoryId)) {
                await this.transactionUpdateService.handleCategoryUpdate(transaction, updateTransactionDto, userId, tx);
            }
            if (totalAmountDiff !== 0) {
                const amountType = totalAmountDiff > 0 ? 2 : 1;
                await this.userAccountService.updateTotalAmount(userId, amountType, Math.abs(totalAmountDiff));
            }
            return result[0];
        });
    }
    async remove(id, userId, removeChildren) {
        await this.getUserAccount(userId);
        const transaction = await this.findOne(id, userId);
        return this.db.transaction(async (tx) => {
            if (transaction.isRecurring) {
                if (transaction.recurringParentId) {
                    await this.recurringTransactionHelper.handleRecurringChildRemoval(transaction, transaction.recurringParentId, tx);
                }
                else {
                    throw new common_1.BadRequestException('Cannot delete a parent transaction of a recurring transaction directly. ' +
                        'Please stop the recurring transaction first!');
                }
            }
            if (removeChildren && !transaction.recurringParentId) {
                await tx
                    .delete(schema.transactions)
                    .where((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, id));
            }
            else {
                await tx
                    .update(schema.transactions)
                    .set({
                    recurringParentId: null,
                    isOrphaned: true,
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, id));
            }
            await tx
                .delete(schema.transactions)
                .where((0, drizzle_orm_1.eq)(schema.transactions.id, id));
            await this.budgetService.updateActualAmount(transaction.categoryId, userId, 1, transaction.amount, transaction.date, tx);
            await this.userAccountService.updateTotalAmount(userId, 1, transaction.amount);
            return { message: 'Transaction removed successfully' };
        });
    }
    async stopRecurringTransaction(transactionId, userId) {
        const transaction = await this.findOne(transactionId, userId);
        if (!transaction.isRecurring) {
            throw new common_1.NotFoundException('Transaction is not a recurring transaction');
        }
        return this.db.transaction(async (tx) => {
            const parentId = transaction.recurringParentId || transaction.id;
            if (transaction.recurringParentId) {
                const parentTransaction = await this.findOne(transaction.recurringParentId, userId);
                if (!parentTransaction) {
                    throw new common_1.NotFoundException('Parent transaction not found');
                }
                if (!parentTransaction.isRecurring) {
                    throw new common_1.NotFoundException('Parent transaction is not a recurring transaction');
                }
            }
            await this.recurringTransactionHelper.stopRecurringTransactionLogic(parentId, tx);
            return { message: 'Recurring transaction stopped successfully' };
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(user_account_service_1.UserAccountService)),
    __param(2, (0, common_1.Inject)(categories_service_1.CategoriesService)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => budget_service_1.BudgetService))),
    __param(4, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(5, (0, common_1.Inject)(recurring_transaction_helper_1.RecurringTransactionHelper)),
    __param(6, (0, common_1.Inject)(transaction_finder_service_1.TransactionFinderService)),
    __param(7, (0, common_1.Inject)(transaction_update_service_1.TransactionUpdateService)),
    __param(8, (0, common_1.Inject)(nestjs_i18n_1.I18nService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        user_account_service_1.UserAccountService,
        categories_service_1.CategoriesService,
        budget_service_1.BudgetService,
        notifications_service_1.NotificationsService,
        recurring_transaction_helper_1.RecurringTransactionHelper,
        transaction_finder_service_1.TransactionFinderService,
        transaction_update_service_1.TransactionUpdateService,
        nestjs_i18n_1.I18nService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map