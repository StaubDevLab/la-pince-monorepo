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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = __importStar(require("../db/schema"));
const dayjs_1 = __importDefault(require("dayjs"));
const drizzle_orm_1 = require("drizzle-orm");
const user_account_service_1 = require("../user-account/user-account.service");
const decimal_js_1 = __importDefault(require("decimal.js"));
let HomeService = class HomeService {
    constructor(db, userAccountService) {
        this.db = db;
        this.userAccountService = userAccountService;
    }
    async findAll(userId, startDate, endDate) {
        const userAccount = await this.userAccountService.findOneByUserId(userId);
        const hebdo = await this.getHebdo(userAccount.id);
        const last6Months = await this.getLast6MonthsData(userAccount.id);
        const byCategories = await this.getByCategoriesBetweenDates(userAccount.id, startDate ? (0, dayjs_1.default)(startDate) : undefined, endDate ? (0, dayjs_1.default)(endDate) : undefined);
        return {
            hebdo: {
                total: hebdo.totalSum,
                perDay: hebdo.totalPerDay,
            },
            last6Months: {
                totalIncome: last6Months.totalIncome,
                totalExpense: last6Months.totalExpense,
                byMonth: last6Months.totalByMonth,
            },
            byCategories: {
                totalByCategory: byCategories.totalByCategory,
                startDate: byCategories.startDate,
                endDate: byCategories.endDate,
            },
        };
    }
    async getHebdo(userAccountId) {
        const startOfWeek = (0, dayjs_1.default)().startOf('week').startOf('day').toDate();
        const endOfWeek = (0, dayjs_1.default)().endOf('week').endOf('day').toDate();
        const result = await this.db
            .select({
            id: schema.transactions.id,
            amount: schema.transactions.amount,
            transactionType: schema.transactions.transactionType,
            date: schema.transactions.date,
        })
            .from(schema.transactions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccountId), (0, drizzle_orm_1.gte)(schema.transactions.date, startOfWeek), (0, drizzle_orm_1.lte)(schema.transactions.date, endOfWeek)))
            .orderBy(schema.transactions.date);
        const totalPerDay = [];
        for (let i = 0; i < 7; i++) {
            const date = (0, dayjs_1.default)(startOfWeek).add(i, 'day').startOf('day').toDate();
            totalPerDay.push({ date, amount: 0 });
        }
        for (const trx of result) {
            const date = (0, dayjs_1.default)(trx.date).startOf('day').toDate();
            const existing = totalPerDay.find(d => d.date.getTime() === date.getTime());
            if (existing) {
                if (trx.transactionType === 2) {
                    existing.amount += trx.amount;
                }
            }
        }
        return {
            start: startOfWeek,
            end: endOfWeek,
            totalPerDay,
            totalSum: totalPerDay.reduce((sum, day) => sum + day.amount, 0),
        };
    }
    async getLast6MonthsData(userAccountId) {
        const startDate = (0, dayjs_1.default)().subtract(5, 'month').startOf('month').toDate();
        const endDate = (0, dayjs_1.default)().endOf('month').toDate();
        const result = await this.db
            .select({
            id: schema.transactions.id,
            amount: schema.transactions.amount,
            date: schema.transactions.date,
            transactionType: schema.transactions.transactionType,
        })
            .from(schema.transactions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccountId), (0, drizzle_orm_1.gte)(schema.transactions.date, startDate), (0, drizzle_orm_1.lte)(schema.transactions.date, endDate)))
            .orderBy(schema.transactions.date);
        const totalByMonth = [];
        for (let i = 0; i < 6; i++) {
            const month = (0, dayjs_1.default)().subtract(5 - i, 'month').format('YYYY-MM');
            totalByMonth.push({ month, income: 0, expense: 0 });
        }
        for (const trx of result) {
            const month = (0, dayjs_1.default)(trx.date).format('YYYY-MM');
            const monthData = totalByMonth.find(m => m.month === month);
            if (!monthData)
                continue;
            if (trx.transactionType === 1) {
                monthData.income = Number(new decimal_js_1.default(monthData.income).plus(trx.amount).toFixed(2));
            }
            else if (trx.transactionType === 2) {
                monthData.expense = Number(new decimal_js_1.default(monthData.expense).plus(trx.amount).toFixed(2));
            }
        }
        return {
            totalByMonth,
            totalIncome: totalByMonth.reduce((sum, month) => sum + month.income, 0),
            totalExpense: totalByMonth.reduce((sum, month) => sum + month.expense, 0),
        };
    }
    async getByCategoriesBetweenDates(userAccountId, startDate = (0, dayjs_1.default)().startOf('month'), endDate = (0, dayjs_1.default)().endOf('month')) {
        if (!(0, dayjs_1.default)(startDate).isValid() || !(0, dayjs_1.default)(endDate).isValid()) {
            throw new common_1.BadRequestException('Invalid date format. Use ISO format (YYYY-MM-DD).');
        }
        if ((0, dayjs_1.default)(startDate).isAfter(endDate)) {
            throw new common_1.BadRequestException('Start date must be before end date.');
        }
        const result = await this.db
            .select({
            id: schema.transactions.id,
            amount: schema.transactions.amount,
            date: schema.transactions.date,
            transactionType: schema.transactions.transactionType,
            categoryId: schema.transactions.categoryId,
        })
            .from(schema.transactions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccountId), (0, drizzle_orm_1.gte)(schema.transactions.date, startDate.toDate()), (0, drizzle_orm_1.lte)(schema.transactions.date, endDate.toDate())))
            .orderBy(schema.transactions.date);
        const totalByCategory = [];
        for (const trx of result) {
            if (trx.transactionType === 2) {
                const existingExpenses = totalByCategory.find(c => c.categoryId === trx.categoryId && c.total > 0);
                if (existingExpenses) {
                    existingExpenses.total = Number(new decimal_js_1.default(existingExpenses.total).plus(trx.amount).toFixed(2));
                }
                else {
                    totalByCategory.push({ categoryId: trx.categoryId, total: trx.amount });
                }
            }
        }
        return {
            totalByCategory,
            startDate,
            endDate,
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        user_account_service_1.UserAccountService])
], HomeService);
//# sourceMappingURL=home.service.js.map