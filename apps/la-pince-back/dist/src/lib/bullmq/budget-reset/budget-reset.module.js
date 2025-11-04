"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetResetModule = void 0;
const common_1 = require("@nestjs/common");
const budget_init_service_1 = require("./budget-init.service");
const budget_reset_service_1 = require("./budget-reset.service");
const budget_reset_processor_1 = require("./budget-reset.processor");
const drizzle_module_1 = require("../../../db/drizzle/drizzle.module");
const bullmq_1 = require("@nestjs/bullmq");
const budget_module_1 = require("../../../budget/budget.module");
const nestjs_1 = require("@bull-board/nestjs");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
let BudgetResetModule = class BudgetResetModule {
};
exports.BudgetResetModule = BudgetResetModule;
exports.BudgetResetModule = BudgetResetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            drizzle_module_1.DrizzleModule,
            (0, common_1.forwardRef)(() => budget_module_1.BudgetModule),
            bullmq_1.BullModule.registerQueue({
                name: 'budgetReset',
            }),
            nestjs_1.BullBoardModule.forFeature({
                name: 'budgetReset',
                adapter: bullMQAdapter_1.BullMQAdapter,
            }),
        ],
        providers: [budget_init_service_1.BudgetInitService, budget_reset_service_1.BudgetResetService, budget_reset_processor_1.BudgetResetProcessor],
        exports: [budget_reset_service_1.BudgetResetService]
    })
], BudgetResetModule);
//# sourceMappingURL=budget-reset.module.js.map