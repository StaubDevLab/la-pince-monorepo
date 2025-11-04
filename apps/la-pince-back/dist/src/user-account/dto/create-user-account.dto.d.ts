import { z } from 'zod';
export declare const CreateUserAccountSchema: z.ZodObject<{
    accountName: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"]>>;
}, "strip", z.ZodTypeAny, {
    accountName: string;
    amount: number;
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
}, {
    accountName: string;
    amount: number;
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
}>;
export type CreateUserAccountDto = z.infer<typeof CreateUserAccountSchema>;
