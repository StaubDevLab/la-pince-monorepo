import { z } from 'zod';
export declare const UpdateTransactionSchema: z.ZodObject<{
    transactionType: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>, 1 | 2, unknown>>;
    amount: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    isRecurring: z.ZodOptional<z.ZodBoolean>;
    recurringFrequency: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["weekly", "biweekly", "monthly", "quarterly", "yearly"]>, z.ZodNumber]>>>, "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined, number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined>;
    recurringEndDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    amount?: number | undefined;
    transactionType?: 1 | 2 | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}, {
    date?: string | undefined;
    amount?: number | undefined;
    transactionType?: unknown;
    description?: string | undefined;
    categoryId?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
