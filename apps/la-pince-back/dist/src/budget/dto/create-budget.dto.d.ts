import { z } from "zod";
export declare const CreateBudgetSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    categoryId: z.ZodString;
    totalAmount: z.ZodNumber;
    recurringFrequency: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["weekly", "biweekly", "monthly", "quarterly", "yearly"]>, z.ZodNumber]>>, "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined, number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined>;
    recurringStartDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}>, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}>, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}, {
    categoryId: string;
    totalAmount: number;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
}>;
export type CreateBudgetDto = z.infer<typeof CreateBudgetSchema>;
