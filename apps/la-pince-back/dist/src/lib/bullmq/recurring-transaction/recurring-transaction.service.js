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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RecurringTransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringTransactionService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const convert_frequency_1 = require("../../../common/convert/convert-frequency");
const dayjs_1 = __importDefault(require("dayjs"));
let RecurringTransactionService = RecurringTransactionService_1 = class RecurringTransactionService {
    constructor(queue) {
        this.queue = queue;
        this.logger = new common_1.Logger(RecurringTransactionService_1.name);
    }
    async scheduleRecurringTransaction(transaction, userId, isParent = true) {
        if (!isParent && transaction.recurringParentId === null) {
            this.logger.error("Cannot schedule a child transaction without a parent ID", { transactionId: transaction.id });
            throw new Error("Cannot schedule a child transaction without a parent ID");
        }
        const parentId = isParent ? transaction.id : transaction.recurringParentId;
        const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(transaction.recurringFrequency ?? 'monthly');
        const delay = this.calculateNextTransactionDelay(transaction.date, { value: frequencyValue, unit: frequencyUnit }, transaction.recurringEndDate);
        if (delay === 0) {
            this.logger.debug(`No further transactions scheduled for ${transaction.id} as the end date has passed or the next transaction is in the past.`);
            return;
        }
        await this.queue.add('create-child-transactions', { transactionParentId: parentId, userId: userId }, {
            delay,
            jobId: `transaction-${transaction.id}`,
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        });
    }
    calculateNextTransactionDelay(lastTransactionDate, frequencyInDays, endDate) {
        const now = (0, dayjs_1.default)();
        const last = (0, dayjs_1.default)(lastTransactionDate);
        const nextTransaction = last.add(frequencyInDays.value, frequencyInDays.unit);
        if (endDate && (0, dayjs_1.default)(endDate) < nextTransaction) {
            this.logger.debug(`Recurring transaction ended on ${endDate}. No further transactions will be scheduled.`);
            return 0;
        }
        const delay = nextTransaction.diff(now, 'milliseconds');
        return delay > 0 ? delay : 0;
    }
    async cancelRecurringTransaction(transactionId) {
        this.logger.debug(`Cancelling recurring transaction for ID: ${transactionId}`);
        const jobId = `transaction-${transactionId}`;
        const job = await this.queue.getJob(jobId);
        if (job) {
            await job.remove();
            this.logger.debug(`Recurring transaction job ${jobId} removed from the queue.`);
        }
        else {
            this.logger.debug(`No recurring transaction job found for ID: ${transactionId}`);
        }
    }
};
exports.RecurringTransactionService = RecurringTransactionService;
exports.RecurringTransactionService = RecurringTransactionService = RecurringTransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('recurringTransaction')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], RecurringTransactionService);
//# sourceMappingURL=recurring-transaction.service.js.map