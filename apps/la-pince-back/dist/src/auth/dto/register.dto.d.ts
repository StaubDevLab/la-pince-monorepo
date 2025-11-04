import { z } from 'zod';
export declare const RegisterDtoSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
    accountName: z.ZodString;
    amount: z.ZodDefault<z.ZodNumber>;
    locale: z.ZodDefault<z.ZodOptional<z.ZodEnum<["fr-FR", "en-US", "es-ES", "de-DE", "it-IT"]>>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
    firstName: string;
    lastName: string;
    email: string;
    accountName: string;
    amount: number;
}, {
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    accountName: string;
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    amount?: number | undefined;
}>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
