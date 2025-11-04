"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringTransactionProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const recurring_transaction_service_1 = require("./recurring-transaction.service");
const transactions_service_1 = require("../../../transactions/transactions.service");
let RecurringTransactionProcessor = class RecurringTransactionProcessor extends bullmq_1.WorkerHost {
    constructor(recurringTransactionService, transactionsService) {
        super();
        this.recurringTransactionService = recurringTransactionService;
        this.transactionsService = transactionsService;
    }
    async process(job) {
        const { transactionParentId, userId } = job.data;
        const transaction = await this.transactionsService.createChildTransactions(transactionParentId, userId);
        if (!transaction) {
            return;
        }
        await this.recurringTransactionService.scheduleRecurringTransaction(transaction, userId, false);
    }
};
exports.RecurringTransactionProcessor = RecurringTransactionProcessor;
exports.RecurringTransactionProcessor = RecurringTransactionProcessor = __decorate([
    (0, bullmq_1.Processor)('recurringTransaction'),
    __param(0, (0, common_1.Inject)(recurring_transaction_service_1.RecurringTransactionService)),
    __param(1, (0, common_1.Inject)(transactions_service_1.TransactionsService)),
    __metadata("design:paramtypes", [recurring_transaction_service_1.RecurringTransactionService,
        transactions_service_1.TransactionsService])
], RecurringTransactionProcessor);
//# sourceMappingURL=recurring-transaction.processor.js.map