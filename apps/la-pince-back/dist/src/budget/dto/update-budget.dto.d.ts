import { z } from "zod";
export declare const UpdateBudgetSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    totalAmount: z.ZodOptional<z.ZodNumber>;
    recurringFrequency: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["weekly", "biweekly", "monthly", "quarterly", "yearly"]>, z.ZodNumber]>>, "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined, number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined>;
    recurringStartDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}, {
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}>, {
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}, {
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}>, {
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}, {
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | undefined;
    recurringStartDate?: string | undefined;
    totalAmount?: number | undefined;
}>;
export type UpdateBudgetDto = z.infer<typeof UpdateBudgetSchema>;
