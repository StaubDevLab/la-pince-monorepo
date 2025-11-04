import { z } from 'zod';
export declare const UpdateUserAccountSchema: z.ZodObject<{
    accountName: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodOptional<z.ZodEnum<["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"]>>>;
}, "strip", z.ZodTypeAny, {
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
    accountName?: string | undefined;
    amount?: number | undefined;
}, {
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
    accountName?: string | undefined;
    amount?: number | undefined;
}>;
export type UpdateUserAccountDto = z.infer<typeof UpdateUserAccountSchema>;
