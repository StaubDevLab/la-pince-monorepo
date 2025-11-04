"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const transactions_controller_1 = require("./transactions.controller");
const drizzle_module_1 = require("../db/drizzle/drizzle.module");
const user_account_module_1 = require("../user-account/user-account.module");
const categories_module_1 = require("../categories/categories.module");
const budget_module_1 = require("../budget/budget.module");
const notifications_module_1 = require("../notifications/notifications.module");
const recurring_transaction_module_1 = require("../lib/bullmq/recurring-transaction/recurring-transaction.module");
const recurring_transaction_helper_1 = require("./services/recurring-transaction.helper");
const transaction_finder_service_1 = require("./services/transaction-finder.service");
const transaction_update_service_1 = require("./services/transaction-update.service");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            drizzle_module_1.DrizzleModule,
            user_account_module_1.UserAccountModule,
            categories_module_1.CategoriesModule,
            (0, common_1.forwardRef)(() => budget_module_1.BudgetModule),
            notifications_module_1.NotificationsModule,
            (0, common_1.forwardRef)(() => recurring_transaction_module_1.RecurringTransactionModule),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            transactions_service_1.TransactionsService,
            recurring_transaction_helper_1.RecurringTransactionHelper,
            transaction_finder_service_1.TransactionFinderService,
            transaction_update_service_1.TransactionUpdateService
        ],
        exports: [
            transactions_service_1.TransactionsService,
            recurring_transaction_helper_1.RecurringTransactionHelper,
            transaction_finder_service_1.TransactionFinderService
        ],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map