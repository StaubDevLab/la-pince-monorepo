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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetResetService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const convert_frequency_1 = require("../../../common/convert/convert-frequency");
const dayjs_1 = __importDefault(require("dayjs"));
let BudgetResetService = class BudgetResetService {
    constructor(queue) {
        this.queue = queue;
    }
    async scheduleBudgetReset(budget) {
        if (!budget.recurringFrequency) {
            throw new Error("Budget does not have a recurring frequency set.");
        }
        const { value: frequencyValue, unit: frequencyUnit } = (0, convert_frequency_1.convertFrequencyToDayjsPeriod)(budget.recurringFrequency);
        const delay = this.calculateNextResetDelay(budget.lastResetDate, { value: frequencyValue, unit: frequencyUnit });
        await this.queue.add('reset-budget', { budgetId: budget.id }, {
            delay,
            jobId: `budget-${budget.id}`,
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        });
    }
    calculateNextResetDelay(lastResetDate, frequencyInDays) {
        const now = (0, dayjs_1.default)();
        const last = (0, dayjs_1.default)(lastResetDate);
        const nextReset = last.add(frequencyInDays.value, frequencyInDays.unit);
        if (nextReset.isBefore(now)) {
            nextReset.add(frequencyInDays.value, frequencyInDays.unit);
        }
        nextReset.startOf('day');
        const delay = nextReset.diff(now, 'milliseconds');
        return delay > 0 ? delay : 0;
    }
    async removeBudgetResetJob(budgetId) {
        const jobId = `budget-${budgetId}`;
        const job = await this.queue.getJob(jobId);
        if (job) {
            await job.remove();
        }
    }
};
exports.BudgetResetService = BudgetResetService;
exports.BudgetResetService = BudgetResetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('budgetReset')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], BudgetResetService);
//# sourceMappingURL=budget-reset.service.js.map