import { Queue } from "bullmq";
import * as schema from "../../../db/schema";
export declare class BudgetResetService {
    private queue;
    constructor(queue: Queue);
    scheduleBudgetReset(budget: schema.Budget): Promise<void>;
    private calculateNextResetDelay;
    removeBudgetResetJob(budgetId: string): Promise<void>;
}
