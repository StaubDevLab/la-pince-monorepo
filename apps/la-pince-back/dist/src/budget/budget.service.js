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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const categories_service_1 = require("../categories/categories.service");
const dayjs_1 = __importDefault(require("dayjs"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const budget_reset_service_1 = require("../lib/bullmq/budget-reset/budget-reset.service");
const notifications_service_1 = require("../notifications/notifications.service");
const transactions_service_1 = require("../transactions/transactions.service");
const convert_frequency_1 = require("../common/convert/convert-frequency");
const nestjs_i18n_1 = require("nestjs-i18n");
dayjs_1.default.extend(isBetween_1.default);
let BudgetService = class BudgetService {
    constructor(db, categoriesService, budgetResetService, notificationsService, transactionsService, i18n) {
        this.db = db;
        this.categoriesService = categoriesService;
        this.budgetResetService = budgetResetService;
        this.notificationsService = notificationsService;
        this.transactionsService = transactionsService;
        this.i18n = i18n;
    }
    async create(createBudgetDto, userId) {
        const category = await this.categoriesService.findOne(createBudgetDto.categoryId, userId);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const existingBudget = await this.findOneByCategoryId(createBudgetDto.categoryId, userId);
        if (existingBudget) {
            throw new common_1.NotFoundException('You already have a budget for this category');
        }
        const startDate = createBudgetDto.recurringStartDate ? (0, dayjs_1.default)(createBudgetDto.recurringStartDate) : (0, dayjs_1.default)();
        const today = (0, dayjs_1.default)();
        let adjustedDate = startDate;
        const rawFrequency = createBudgetDto.recurringFrequency || 'monthly';
        const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(rawFrequency);
        while (adjustedDate.add(frequencyValue, frequencyUnit).isBefore(today) || adjustedDate.add(frequencyValue, frequencyUnit).isSame(today)) {
            adjustedDate = adjustedDate.add(frequencyValue, frequencyUnit);
        }
        const totalSinceStart = await this.transactionsService.findAllByCategoryId(createBudgetDto.categoryId, userId, adjustedDate.toDate());
        const actualAmount = totalSinceStart.reduce((sum, transaction) => {
            return sum + (transaction.transactionType === 1 ? -transaction.amount : transaction.amount);
        }, 0);
        const budget = await this.db.insert(schema.budgets).values({
            ...createBudgetDto,
            actualAmount,
            userId,
            recurringStartDate: adjustedDate.toISOString(),
            lastResetDate: adjustedDate.toISOString() ?? new Date().toISOString(),
            createdAt: new Date(),
        }).returning();
        if (createBudgetDto.recurringFrequency) {
            await this.budgetResetService.scheduleBudgetReset(budget[0]);
        }
        return budget[0];
    }
    async findAllByUserId(userId) {
        return this.db.select().from(schema.budgets).where((0, drizzle_orm_1.eq)(schema.budgets.userId, userId)).orderBy((0, drizzle_orm_1.desc)(schema.budgets.createdAt));
    }
    async findOne(id, userId) {
        const result = await this.db
            .select()
            .from(schema.budgets)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.budgets.id, id), (0, drizzle_orm_1.eq)(schema.budgets.userId, userId)));
        if (result.length === 0) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return result[0];
    }
    async findOneByCategoryId(categoryId, userId) {
        const result = await this.db
            .select()
            .from(schema.budgets)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.budgets.categoryId, categoryId), (0, drizzle_orm_1.eq)(schema.budgets.userId, userId)));
        if (result.length === 0) {
            return null;
        }
        else {
            return result[0];
        }
    }
    async update(id, updateBudgetDto, userId) {
        const budget = await this.findOne(id, userId);
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        const startDate = updateBudgetDto.recurringStartDate ? (0, dayjs_1.default)(updateBudgetDto.recurringStartDate) : undefined;
        const today = (0, dayjs_1.default)();
        let adjustedDate = startDate;
        let actualAmount = budget.actualAmount;
        if (adjustedDate) {
            const rawFrequency = updateBudgetDto.recurringFrequency || budget.recurringFrequency || 'monthly';
            const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(rawFrequency);
            while (adjustedDate.add(frequencyValue, frequencyUnit).isBefore(today) || adjustedDate.add(frequencyValue, frequencyUnit).isSame(today)) {
                adjustedDate = adjustedDate.add(frequencyValue, frequencyUnit);
            }
            const totalSinceStart = await this.transactionsService.findAllByCategoryId(budget.categoryId, userId, adjustedDate.toDate());
            actualAmount = totalSinceStart.reduce((sum, transaction) => {
                return sum + (transaction.transactionType === 1 ? -transaction.amount : transaction.amount);
            }, 0);
        }
        return this.db.transaction(async (tx) => {
            const result = await tx
                .update(schema.budgets)
                .set({
                totalAmount: updateBudgetDto.totalAmount,
                actualAmount,
                lastResetDate: adjustedDate ? adjustedDate.toISOString() : budget.lastResetDate,
                recurringStartDate: adjustedDate?.toISOString(),
                recurringFrequency: updateBudgetDto.recurringFrequency,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.budgets.id, id))
                .returning();
            if (updateBudgetDto.recurringFrequency && budget.recurringFrequency !== updateBudgetDto.recurringFrequency) {
                await this.budgetResetService.removeBudgetResetJob(id);
                await this.budgetResetService.scheduleBudgetReset(result[0]);
            }
            else if (adjustedDate && budget.recurringStartDate !== adjustedDate.toISOString()) {
                await this.budgetResetService.removeBudgetResetJob(id);
                await this.budgetResetService.scheduleBudgetReset(result[0]);
            }
            return result[0];
        });
    }
    async updateActualAmount(categoryId, userId, type, amount, transactionDate, tx) {
        const budget = await this.findOneByCategoryId(categoryId, userId);
        if (!budget) {
            return null;
        }
        let actualAmount = budget.actualAmount;
        if (type === 1) {
            actualAmount -= amount;
            if (actualAmount < 0) {
                actualAmount = 0;
            }
        }
        else if (type === 2) {
            actualAmount += amount;
        }
        const startDate = (0, dayjs_1.default)(budget.lastResetDate);
        const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(budget.recurringFrequency);
        const endDate = (0, dayjs_1.default)(budget.lastResetDate).add(frequencyValue, frequencyUnit);
        const transactionDay = (0, dayjs_1.default)(transactionDate);
        if (!transactionDay.isBetween(startDate, endDate, 'day', '[)')) {
            return null;
        }
        let data = null;
        if (tx) {
            data = await tx
                .update(schema.budgets)
                .set({
                actualAmount,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.budgets.id, budget.id))
                .returning();
        }
        else {
            data = await this.db
                .update(schema.budgets)
                .set({
                actualAmount,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.budgets.id, budget.id))
                .returning();
        }
        if (data.length === 0 || !data[0]) {
            return null;
        }
        else {
            if (actualAmount >= budget.totalAmount * 0.75) {
                const category = await this.categoriesService.findOne(budget.categoryId, userId);
                if (actualAmount >= budget.totalAmount) {
                    await this.notificationsService.create({
                        type: "budget",
                        message: this.i18n.t('common.BUDGET.reached', { args: { categoryName: category.name }, lang: nestjs_i18n_1.I18nContext.current()?.lang || 'en' }),
                        level: "error",
                    }, userId);
                }
                else {
                    await this.notificationsService.create({
                        type: "budget",
                        message: this.i18n.t('common.BUDGET.75', { args: { categoryName: category.name }, lang: nestjs_i18n_1.I18nContext.current()?.lang || 'en' }),
                        level: "warning",
                    }, userId);
                }
            }
            return data[0];
        }
    }
    async resetActualAmount(id) {
        const budget = await this.db
            .select()
            .from(schema.budgets)
            .where((0, drizzle_orm_1.eq)(schema.budgets.id, id));
        if (budget.length === 0) {
            return null;
        }
        const result = await this.db
            .update(schema.budgets)
            .set({
            actualAmount: 0,
            lastResetDate: new Date().toISOString(),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.budgets.id, id))
            .returning();
        if (result.length > 0) {
            const budgetData = result[0];
            const category = await this.categoriesService.findOne(budgetData.categoryId, budgetData.userId);
            await this.notificationsService.create({
                type: "budget",
                message: this.i18n.t('common.BUDGET.reset', { args: { categoryName: category.name }, lang: nestjs_i18n_1.I18nContext.current()?.lang || 'en' }),
                level: "info",
            }, budgetData.userId);
        }
        if (result.length === 0) {
            return null;
        }
        else {
            return result[0];
        }
    }
    async remove(id, userId) {
        return this.db.transaction(async (tx) => {
            await tx
                .delete(schema.budgets)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.budgets.id, id), (0, drizzle_orm_1.eq)(schema.budgets.userId, userId)))
                .then(() => undefined);
            await this.budgetResetService.removeBudgetResetJob(id);
        });
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(categories_service_1.CategoriesService)),
    __param(2, (0, common_1.Inject)(budget_reset_service_1.BudgetResetService)),
    __param(3, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => transactions_service_1.TransactionsService))),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        categories_service_1.CategoriesService,
        budget_reset_service_1.BudgetResetService,
        notifications_service_1.NotificationsService,
        transactions_service_1.TransactionsService,
        nestjs_i18n_1.I18nService])
], BudgetService);
//# sourceMappingURL=budget.service.js.map