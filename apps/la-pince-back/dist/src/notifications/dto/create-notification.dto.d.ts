import { z } from 'zod';
export declare const typeEnum: z.ZodEnum<["transaction", "budget", "reminder"]>;
export declare const createNotificationSchema: z.ZodObject<{
    type: z.ZodEnum<["transaction", "budget", "reminder"]>;
    message: z.ZodString;
    level: z.ZodDefault<z.ZodEnum<["success", "info", "warning", "error"]>>;
}, "strip", z.ZodTypeAny, {
    type: "transaction" | "budget" | "reminder";
    message: string;
    level: "success" | "info" | "warning" | "error";
}, {
    type: "transaction" | "budget" | "reminder";
    message: string;
    level?: "success" | "info" | "warning" | "error" | undefined;
}>;
export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
