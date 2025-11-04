import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import dayjs from 'dayjs';
import { UserAccountService } from 'src/user-account/user-account.service';
export declare class HomeService {
    private readonly db;
    private readonly userAccountService;
    constructor(db: NodePgDatabase<typeof schema>, userAccountService: UserAccountService);
    findAll(userId: string, startDate?: string, endDate?: string): Promise<{
        hebdo: {
            total: number;
            perDay: {
                date: Date;
                amount: number;
            }[];
        };
        last6Months: {
            totalIncome: number;
            totalExpense: number;
            byMonth: {
                month: string;
                income: number;
                expense: number;
            }[];
        };
        byCategories: {
            totalByCategory: {
                categoryId: string;
                total: number;
            }[];
            startDate: dayjs.Dayjs;
            endDate: dayjs.Dayjs;
        };
    }>;
    private getHebdo;
    private getLast6MonthsData;
    private getByCategoriesBetweenDates;
}
