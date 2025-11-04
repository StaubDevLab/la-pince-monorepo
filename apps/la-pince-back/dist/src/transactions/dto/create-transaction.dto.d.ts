import { z } from 'zod';
export declare const CreateTransactionSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    transactionType: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>, 1 | 2, unknown>;
    amount: z.ZodNumber;
    date: z.ZodUnion<[z.ZodString, z.ZodString]>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    isRecurring: z.ZodOptional<z.ZodBoolean>;
    recurringFrequency: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["weekly", "biweekly", "monthly", "quarterly", "yearly"]>, z.ZodNumber]>>>, "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined, number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined>;
    recurringEndDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
}, "strip", z.ZodTypeAny, {
    date: string;
    amount: number;
    transactionType: 1 | 2;
    categoryId: string;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}, {
    date: string;
    amount: number;
    categoryId: string;
    transactionType?: unknown;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}>, {
    date: string;
    amount: number;
    transactionType: 1 | 2;
    categoryId: string;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}, {
    date: string;
    amount: number;
    categoryId: string;
    transactionType?: unknown;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}>, {
    date: string;
    amount: number;
    transactionType: 1 | 2;
    categoryId: string;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}, {
    date: string;
    amount: number;
    categoryId: string;
    transactionType?: unknown;
    description?: string | undefined;
    isRecurring?: boolean | undefined;
    recurringFrequency?: number | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | null | undefined;
    recurringEndDate?: string | null | undefined;
}>;
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
