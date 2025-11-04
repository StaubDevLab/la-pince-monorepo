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
exports.TransactionInitService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../../../db/drizzle/drizzle.provider");
const schema = __importStar(require("../../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const recurring_transaction_service_1 = require("./recurring-transaction.service");
let TransactionInitService = class TransactionInitService {
    constructor(db, reccuringTransactionService) {
        this.db = db;
        this.reccuringTransactionService = reccuringTransactionService;
    }
    async onModuleInit() {
        const trx = await this.db.select({
            transaction: schema.transactions,
            transactionRecurringInfo: schema.transactionRecurringInfo,
        })
            .from(schema.transactionRecurringInfo)
            .leftJoin(schema.transactions, (0, drizzle_orm_1.eq)(schema.transactionRecurringInfo.lastTransactionId, schema.transactions.id));
        const accounts = await this.db.select().from(schema.userAccounts);
        for (const transaction of trx) {
            if (!transaction.transaction) {
                console.warn(`Transaction not found for recurring info ${transaction.transactionRecurringInfo.id}`);
                continue;
            }
            const account = accounts.find(acc => acc.id === transaction.transaction?.userAccountId);
            if (!account) {
                console.warn(`Account not found for transaction ${transaction.transaction?.id}`);
                continue;
            }
            else {
                await this.reccuringTransactionService.scheduleRecurringTransaction(transaction.transaction, account.userId, true);
            }
        }
    }
};
exports.TransactionInitService = TransactionInitService;
exports.TransactionInitService = TransactionInitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(recurring_transaction_service_1.RecurringTransactionService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        recurring_transaction_service_1.RecurringTransactionService])
], TransactionInitService);
//# sourceMappingURL=transaction-init.service.js.map