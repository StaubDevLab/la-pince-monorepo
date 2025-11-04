import { OnModuleInit } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "src/db/schema";
import { RecurringTransactionService } from "./recurring-transaction.service";
export declare class TransactionInitService implements OnModuleInit {
    private readonly db;
    private readonly reccuringTransactionService;
    constructor(db: NodePgDatabase<typeof schema>, reccuringTransactionService: RecurringTransactionService);
    onModuleInit(): Promise<void>;
}
