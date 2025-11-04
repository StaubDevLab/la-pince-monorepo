"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringTransactionModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const recurring_transaction_service_1 = require("./recurring-transaction.service");
const recurring_transaction_processor_1 = require("./recurring-transaction.processor");
const transactions_module_1 = require("../../../transactions/transactions.module");
const transaction_init_service_1 = require("./transaction-init.service");
const drizzle_module_1 = require("../../../db/drizzle/drizzle.module");
const nestjs_1 = require("@bull-board/nestjs");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
let RecurringTransactionModule = class RecurringTransactionModule {
};
exports.RecurringTransactionModule = RecurringTransactionModule;
exports.RecurringTransactionModule = RecurringTransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'recurringTransaction',
            }),
            (0, common_1.forwardRef)(() => transactions_module_1.TransactionsModule),
            drizzle_module_1.DrizzleModule,
            nestjs_1.BullBoardModule.forFeature({
                name: 'recurringTransaction',
                adapter: bullMQAdapter_1.BullMQAdapter,
            }),
        ],
        providers: [recurring_transaction_service_1.RecurringTransactionService, recurring_transaction_processor_1.RecurringTransactionProcessor, transaction_init_service_1.TransactionInitService],
        exports: [recurring_transaction_service_1.RecurringTransactionService],
    })
], RecurringTransactionModule);
//# sourceMappingURL=recurring-transaction.module.js.map