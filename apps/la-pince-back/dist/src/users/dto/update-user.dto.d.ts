import { z } from 'zod';
export declare const UpdateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["fr-FR", "en-US", "es-ES", "de-DE", "it-IT"]>>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}, {
    locale?: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
