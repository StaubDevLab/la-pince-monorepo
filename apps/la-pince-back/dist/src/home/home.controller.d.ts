import { HomeService } from './home.service';
import { UserEntity } from '../decorator/user.decorator';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    findAll(user: UserEntity, startDate: string, endDate: string): Promise<{
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
            startDate: import("dayjs").Dayjs;
            endDate: import("dayjs").Dayjs;
        };
    }>;
}
