import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { UserEntity } from 'src/decorator/user.decorator';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    create(createBudgetDto: CreateBudgetDto, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
        recurringStartDate: string;
        totalAmount: number;
        actualAmount: number;
        lastResetDate: string;
    }>;
    findAll(user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
        recurringStartDate: string;
        totalAmount: number;
        actualAmount: number;
        lastResetDate: string;
    }[]>;
    findOne(id: string, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
        recurringStartDate: string;
        totalAmount: number;
        actualAmount: number;
        lastResetDate: string;
    }>;
    update(id: string, updateBudgetDto: UpdateBudgetDto, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        recurringFrequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
        recurringStartDate: string;
        totalAmount: number;
        actualAmount: number;
        lastResetDate: string;
    }>;
    remove(id: string, user: UserEntity): Promise<void>;
}
