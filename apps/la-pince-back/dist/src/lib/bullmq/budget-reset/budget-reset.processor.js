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
exports.BudgetResetProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const budget_reset_service_1 = require("./budget-reset.service");
const budget_service_1 = require("../../../budget/budget.service");
let BudgetResetProcessor = class BudgetResetProcessor extends bullmq_1.WorkerHost {
    constructor(budgetResetService, budgetService) {
        super();
        this.budgetResetService = budgetResetService;
        this.budgetService = budgetService;
    }
    async process(job) {
        const budget = await this.budgetService.resetActualAmount(job.data.budgetId);
        if (!budget) {
            return;
        }
        await this.budgetResetService.scheduleBudgetReset(budget);
    }
};
exports.BudgetResetProcessor = BudgetResetProcessor;
exports.BudgetResetProcessor = BudgetResetProcessor = __decorate([
    (0, bullmq_1.Processor)('budgetReset'),
    __param(0, (0, common_1.Inject)(budget_reset_service_1.BudgetResetService)),
    __param(1, (0, common_1.Inject)(budget_service_1.BudgetService)),
    __metadata("design:paramtypes", [budget_reset_service_1.BudgetResetService,
        budget_service_1.BudgetService])
], BudgetResetProcessor);
//# sourceMappingURL=budget-reset.processor.js.map