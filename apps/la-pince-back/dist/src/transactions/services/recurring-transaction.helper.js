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
exports.RecurringTransactionHelper = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../../db/drizzle/drizzle.provider");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const dayjs_1 = __importDefault(require("dayjs"));
const convert_frequency_1 = require("../../common/convert/convert-frequency");
const recurring_transaction_service_1 = require("../../lib/bullmq/recurring-transaction/recurring-transaction.service");
const budget_service_1 = require("../../budget/budget.service");
const user_account_service_1 = require("../../user-account/user-account.service");
let RecurringTransactionHelper = class RecurringTransactionHelper {
    constructor(db, recurringTransactionService, budgetService, userAccountService) {
        this.db = db;
        this.recurringTransactionService = recurringTransactionService;
        this.budgetService = budgetService;
        this.userAccountService = userAccountService;
    }
    getChildTransactionDescription(parentDescription) {
        if (!parentDescription)
            return 'Recurring Transaction';
        return /\(Child\)\s*$/i.test(parentDescription)
            ? parentDescription
            : `${parentDescription}`;
    }
    async processRecurringTransactions(parentTransaction, userId, tx) {
        const db = tx || this.db;
        let adjustedDate = (0, dayjs_1.default)(parentTransaction.date);
        let lastTransaction = parentTransaction;
        const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(parentTransaction.recurringFrequency || 'monthly');
        while (adjustedDate.add(frequencyValue, frequencyUnit).isBefore((0, dayjs_1.default)())) {
            adjustedDate = adjustedDate.add(frequencyValue, frequencyUnit);
            const { id, ...rest } = lastTransaction;
            const childDescription = this.getChildTransactionDescription(lastTransaction.description);
            const newTransaction = {
                ...rest,
                description: childDescription,
                date: adjustedDate.toDate(),
                recurringStartDate: parentTransaction.recurringStartDate,
                recurringEndDate: parentTransaction.recurringEndDate,
                recurringParentId: parentTransaction.id,
                createdAt: new Date(),
            };
            const newResult = await db.insert(schema.transactions)
                .values(newTransaction)
                .returning();
            lastTransaction = newResult[0];
            await this.budgetService.updateActualAmount(newTransaction.categoryId, userId, newResult[0].transactionType, newResult[0].amount, newResult[0].date, tx);
            await this.userAccountService.updateTotalAmount(userId, newResult[0].transactionType, newResult[0].amount);
        }
        return {
            lastTransactionDate: adjustedDate.toDate(),
            lastTransactionId: lastTransaction.id,
            transaction: lastTransaction
        };
    }
    async storeAndScheduleRecurringTransaction(recurringResult, userId, isFirstTransaction, tx) {
        const db = tx || this.db;
        await this.recurringTransactionService.scheduleRecurringTransaction(recurringResult.transaction, userId, isFirstTransaction);
        await db.insert(schema.transactionRecurringInfo).values({
            transactionParentId: recurringResult.transaction.recurringParentId || recurringResult.transaction.id,
            lastTransactionDate: recurringResult.lastTransactionDate,
            lastTransactionId: recurringResult.lastTransactionId,
            createdAt: new Date(),
        });
    }
    async convertToRecurring(transaction, userId, tx) {
        if (!transaction.recurringFrequency) {
            throw new Error('Recurring frequency is required to create a recurring transaction');
        }
        const recurringResult = await this.processRecurringTransactions(transaction, userId, tx);
        await this.storeAndScheduleRecurringTransaction({
            transaction,
            lastTransactionDate: recurringResult.lastTransactionDate,
            lastTransactionId: recurringResult.lastTransactionId
        }, userId, recurringResult.transaction.id === transaction.id, tx);
        return await this.userAccountService.findOneByUserId(userId);
    }
    async stopRecurringTransactionLogic(parentId, tx) {
        const lastChild = await tx
            .select()
            .from(schema.transactionRecurringInfo)
            .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.transactionParentId, parentId))
            .orderBy((0, drizzle_orm_1.desc)(schema.transactionRecurringInfo.lastTransactionDate))
            .limit(1)
            .then(result => result[0]);
        if (!lastChild) {
            throw new Error('No child transactions found for this parent transaction');
        }
        await this.recurringTransactionService.cancelRecurringTransaction(lastChild.lastTransactionId);
        await tx.delete(schema.transactionRecurringInfo)
            .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.transactionParentId, parentId));
        await tx.update(schema.transactions)
            .set({
            isRecurring: false,
            recurringFrequency: null,
            recurringEndDate: null,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.transactions.id, parentId));
        await tx.update(schema.transactions)
            .set({
            isRecurring: false,
            recurringFrequency: null,
            recurringEndDate: null,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, parentId));
    }
    async handleRecurringChildRemoval(transaction, recurringParentId, tx) {
        const recurringInfo = await tx
            .select()
            .from(schema.transactionRecurringInfo)
            .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.transactionParentId, recurringParentId))
            .orderBy((0, drizzle_orm_1.desc)(schema.transactionRecurringInfo.lastTransactionDate))
            .limit(1)
            .then(result => result[0]);
        if (!recurringInfo || recurringInfo.lastTransactionId !== transaction.id) {
            return;
        }
        const previousChild = await tx
            .select()
            .from(schema.transactions)
            .where((0, drizzle_orm_1.eq)(schema.transactions.recurringParentId, recurringParentId))
            .orderBy((0, drizzle_orm_1.desc)(schema.transactions.date))
            .limit(2)
            .then(result => {
            if (result.length < 2)
                return null;
            return result[1];
        });
        if (previousChild) {
            await tx
                .update(schema.transactionRecurringInfo)
                .set({ lastTransactionId: previousChild.id })
                .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.id, recurringInfo.id));
        }
        else {
            await tx
                .update(schema.transactionRecurringInfo)
                .set({ lastTransactionId: recurringParentId })
                .where((0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.id, recurringInfo.id));
        }
    }
};
exports.RecurringTransactionHelper = RecurringTransactionHelper;
exports.RecurringTransactionHelper = RecurringTransactionHelper = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(recurring_transaction_service_1.RecurringTransactionService)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => budget_service_1.BudgetService))),
    __param(3, (0, common_1.Inject)(user_account_service_1.UserAccountService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        recurring_transaction_service_1.RecurringTransactionService,
        budget_service_1.BudgetService,
        user_account_service_1.UserAccountService])
], RecurringTransactionHelper);
//# sourceMappingURL=recurring-transaction.helper.js.map