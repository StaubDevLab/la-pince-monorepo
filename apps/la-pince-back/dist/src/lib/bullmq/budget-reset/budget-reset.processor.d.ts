import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { BudgetResetService } from "./budget-reset.service";
import { BudgetService } from "src/budget/budget.service";
export declare class BudgetResetProcessor extends WorkerHost {
    private budgetResetService;
    private budgetService;
    constructor(budgetResetService: BudgetResetService, budgetService: BudgetService);
    process(job: Job<{
        budgetId: string;
    }>): Promise<void>;
}
