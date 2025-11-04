import { z } from 'zod';
export declare const UpdateNotificationSchema: z.ZodObject<{
    isRead: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    isRead: boolean;
}, {
    isRead?: boolean | undefined;
}>;
export type UpdateNotificationDto = z.infer<typeof UpdateNotificationSchema>;
export declare const UpdateMultipleNotificationsSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodString, "many">;
    isRead: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    isRead: boolean;
    ids: string[];
}, {
    ids: string[];
    isRead?: boolean | undefined;
}>;
export type UpdateMultipleNotificationsDto = z.infer<typeof UpdateMultipleNotificationsSchema>;
