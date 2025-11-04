import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    password: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>, string, string>;
    accountType: z.ZodDefault<z.ZodOptional<z.ZodEnum<["in-app", "google"]>>>;
    locale: z.ZodDefault<z.ZodOptional<z.ZodEnum<["fr-FR", "en-US", "es-ES", "de-DE", "it-IT"]>>>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
    firstName: string;
    lastName: string;
    email: string;
    accountType: "in-app" | "google";
    avatar?: string | undefined;
}, {
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    accountType?: "in-app" | "google" | undefined;
    avatar?: string | undefined;
}>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
