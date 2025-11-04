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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUpdateService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../../db/drizzle/drizzle.provider");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const budget_service_1 = require("../../budget/budget.service");
const dayjs_1 = __importDefault(require("dayjs"));
const convert_frequency_1 = require("../../common/convert/convert-frequency");
let TransactionUpdateService = class TransactionUpdateService {
    constructor(db, budgetService) {
        this.db = db;
        this.budgetService = budgetService;
    }
    validateChildTransactionUpdate(transaction, updateTransactionDto) {
        if (transaction.recurringParentId &&
            (updateTransactionDto.isRecurring ||
                updateTransactionDto.recurringFrequency ||
                updateTransactionDto.recurringEndDate)) {
            throw new common_1.BadRequestException('Cannot add a recurrency on a child transaction!');
        }
        if (transaction.recurringParentId &&
            updateTransactionDto.categoryId &&
            (updateTransactionDto.categoryId !== transaction.categoryId)) {
            throw new common_1.BadRequestException('Cannot change the category of a child transaction of a recurring transaction! ' +
                'If you want to change the category, please update the category of the parent transaction.');
        }
        if (transaction.recurringParentId &&
            updateTransactionDto.transactionType &&
            (updateTransactionDto.transactionType !== transaction.transactionType)) {
            throw new common_1.BadRequestException('Cannot change the transaction type of a child transaction of a recurring transaction! ' +
                'If you want to change the transaction type, please stop the recurring transaction first.');
        }
    }
    async handleAmountUpdate(transaction, updateTransactionDto, userId, tx, updateNextChilds) {
        if (!updateTransactionDto.amount || updateTransactionDto.amount === transaction.amount) {
            return 0;
        }
        const amountDiff = updateTransactionDto.amount - transaction.amount;
        let totalAmountDiff = amountDiff;
        const amountType = amountDiff > 0 ? 2 : 1;
        if (transaction.isRecurring && !transaction.recurringParentId && updateNextChilds) {
            const data = await tx
                .update(schema.transactions)
                .set({ amount: updateTransactionDto.amount })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, transaction.id), (0, drizzle_orm_1.eq)(schema.transactions.amount, transaction.amount)))
                .returning();
            totalAmountDiff += amountDiff * data.length;
            const budget = await tx
                .select()
                .from(schema.budgets)
                .where((0, drizzle_orm_1.eq)(schema.budgets.categoryId, transaction.categoryId))
                .then(result => result[0]);
            if (budget) {
                const { value, unit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(budget.recurringFrequency || 'monthly');
                const startDateBudgetPeriod = (0, dayjs_1.default)(budget.lastResetDate).toDate();
                const endDateBudgetPeriod = (0, dayjs_1.default)(budget.lastResetDate).add(value, unit).toDate();
                let totalAmountDiffForThisBudget = 0;
                for (const childTransaction of data) {
                    if (childTransaction.date >= startDateBudgetPeriod && childTransaction.date <= endDateBudgetPeriod) {
                        totalAmountDiffForThisBudget += Math.abs(amountDiff);
                    }
                }
                const isOriginalInPeriod = (transaction.date >= startDateBudgetPeriod &&
                    transaction.date <= endDateBudgetPeriod);
                await this.budgetService.updateActualAmount(transaction.categoryId, userId, amountType, Math.abs(isOriginalInPeriod ? amountDiff : 0) + totalAmountDiffForThisBudget, (0, dayjs_1.default)().toDate(), tx);
            }
        }
        else {
            await this.budgetService.updateActualAmount(updateTransactionDto.categoryId ?? transaction.categoryId, userId, amountType, Math.abs(amountDiff), updateTransactionDto.date ? new Date(updateTransactionDto.date) : transaction.date, tx);
        }
        return totalAmountDiff;
    }
    async handleCategoryUpdate(transaction, updateTransactionDto, userId, tx) {
        if (!updateTransactionDto.categoryId || updateTransactionDto.categoryId === transaction.categoryId) {
            return;
        }
        if (transaction.isRecurring && !transaction.recurringParentId) {
            const newBudgetCategory = await tx
                .select()
                .from(schema.budgets)
                .where((0, drizzle_orm_1.eq)(schema.budgets.categoryId, updateTransactionDto.categoryId))
                .then(result => result[0]);
            if (newBudgetCategory) {
                const { value, unit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(newBudgetCategory.recurringFrequency || 'monthly');
                const startDateBudgetPeriod = (0, dayjs_1.default)(newBudgetCategory.lastResetDate).toDate();
                const endDateBudgetPeriod = (0, dayjs_1.default)(newBudgetCategory.lastResetDate).add(value, unit).toDate();
                const childTransactions = await tx
                    .select({
                    sumAmount: (0, drizzle_orm_1.sum)(schema.transactions.amount),
                })
                    .from(schema.transactions)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, transaction.id), (0, drizzle_orm_1.eq)(schema.transactions.id, transaction.id)), (0, drizzle_orm_1.gte)(schema.transactions.date, startDateBudgetPeriod), (0, drizzle_orm_1.lte)(schema.transactions.date, endDateBudgetPeriod)))
                    .then(result => result[0]);
                if (childTransactions && childTransactions.sumAmount) {
                    const sumAmount = parseInt(childTransactions.sumAmount);
                    await this.budgetService.updateActualAmount(transaction.categoryId, userId, transaction.transactionType, -sumAmount, (0, dayjs_1.default)().toDate(), tx);
                    await this.budgetService.updateActualAmount(updateTransactionDto.categoryId, userId, updateTransactionDto.transactionType ?? transaction.transactionType, sumAmount, (0, dayjs_1.default)().toDate(), tx);
                }
            }
            await tx
                .update(schema.transactions)
                .set({
                categoryId: updateTransactionDto.categoryId,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, transaction.id));
        }
        else {
            await this.budgetService.updateActualAmount(transaction.categoryId, userId, transaction.transactionType, -transaction.amount, transaction.date, tx);
            await this.budgetService.updateActualAmount(updateTransactionDto.categoryId, userId, updateTransactionDto.transactionType ?? transaction.transactionType, updateTransactionDto.amount ?? transaction.amount, updateTransactionDto.date ? new Date(updateTransactionDto.date) : transaction.date, tx);
        }
    }
};
exports.TransactionUpdateService = TransactionUpdateService;
exports.TransactionUpdateService = TransactionUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => budget_service_1.BudgetService))),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        budget_service_1.BudgetService])
], TransactionUpdateService);
//# sourceMappingURL=transaction-update.service.js.map