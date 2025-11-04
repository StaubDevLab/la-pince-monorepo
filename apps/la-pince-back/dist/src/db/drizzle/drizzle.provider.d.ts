import { ConfigService } from "@nestjs/config";
import * as schema from '../schema';
export declare const DrizzleAsyncProvider = "DrizzleAsyncProvider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
export declare const drizzleProvider: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (configService: ConfigService) => Promise<NodePgDatabase<typeof schema>>;
}[];
