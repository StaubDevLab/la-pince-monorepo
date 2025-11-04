import { z } from 'zod';
export declare const FirstLoginSchema: z.ZodObject<{
    totalAmount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"]>>;
    accountName: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["fr-FR", "en-US", "es-ES", "de-DE", "it-IT"]>>;
}, "strip", z.ZodTypeAny, {
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
    accountName?: string | undefined;
    totalAmount?: number | undefined;
}, {
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    currency?: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD" | undefined;
    accountName?: string | undefined;
    totalAmount?: number | undefined;
}>;
export type FirstLoginDto = z.infer<typeof FirstLoginSchema>;
