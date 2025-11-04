import { OnModuleInit } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "src/db/schema";
import { BudgetResetService } from "./budget-reset.service";
export declare class BudgetInitService implements OnModuleInit {
    private readonly db;
    private readonly budgetResetService;
    constructor(db: NodePgDatabase<typeof schema>, budgetResetService: BudgetResetService);
    onModuleInit(): Promise<void>;
}
