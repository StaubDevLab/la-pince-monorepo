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
exports.TransactionFinderService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../../db/drizzle/drizzle.provider");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const user_account_service_1 = require("../../user-account/user-account.service");
let TransactionFinderService = class TransactionFinderService {
    constructor(db, userAccountService) {
        this.db = db;
        this.userAccountService = userAccountService;
    }
    async getUserAccount(userId) {
        const userAccount = await this.userAccountService.findOneByUserId(userId);
        if (!userAccount) {
            throw new common_1.NotFoundException('User account not found');
        }
        return userAccount;
    }
    async findAll(userId, limit = 10, page = 0) {
        const userAccount = await this.getUserAccount(userId);
        const [transactionsWithCategories, countResult] = await Promise.all([
            this.db
                .select({
                transaction: schema.transactions,
                category: schema.categories
            })
                .from(schema.transactions)
                .leftJoin(schema.categories, (0, drizzle_orm_1.eq)(schema.categories.id, schema.transactions.categoryId))
                .where((0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccount.id))
                .limit(limit)
                .offset(page * limit)
                .orderBy((0, drizzle_orm_1.desc)(schema.transactions.date)),
            this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema.transactions)
                .where((0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccount.id))
        ]);
        const data = transactionsWithCategories.map(row => {
            const transaction = row.transaction;
            transaction.category = row.category ?? null;
            return transaction;
        });
        const totalCount = countResult[0].count;
        const lastPage = Math.ceil(totalCount / limit) - 1;
        return {
            data,
            limit,
            page,
            total: totalCount,
            lastPage: lastPage >= 0 ? lastPage : 0
        };
    }
    async findAllByCategoryId(categoryId, userId, startDate) {
        const userAccount = await this.getUserAccount(userId);
        const whereCondition = startDate
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.categoryId, categoryId), (0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccount.id), (0, drizzle_orm_1.gte)(schema.transactions.date, startDate))
            : (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.categoryId, categoryId), (0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccount.id));
        return this.db
            .select()
            .from(schema.transactions)
            .where(whereCondition)
            .orderBy((0, drizzle_orm_1.desc)(schema.transactions.date));
    }
    async findOne(id, userId) {
        const userAccount = await this.getUserAccount(userId);
        const result = await this.db
            .select({
            transaction: schema.transactions,
            category: schema.categories
        })
            .from(schema.transactions)
            .leftJoin(schema.categories, (0, drizzle_orm_1.eq)(schema.categories.id, schema.transactions.categoryId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.transactions.id, id), (0, drizzle_orm_1.eq)(schema.transactions.userAccountId, userAccount.id)))
            .limit(1);
        if (result.length === 0) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        const transaction = result[0].transaction;
        transaction.category = result[0].category ?? null;
        return transaction;
    }
};
exports.TransactionFinderService = TransactionFinderService;
exports.TransactionFinderService = TransactionFinderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(user_account_service_1.UserAccountService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        user_account_service_1.UserAccountService])
], TransactionFinderService);
//# sourceMappingURL=transaction-finder.service.js.map