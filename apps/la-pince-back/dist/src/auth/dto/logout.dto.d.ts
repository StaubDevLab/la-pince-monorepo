import { z } from "zod";
export declare const LogoutDtoSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sessionId: string;
}, {
    sessionId: string;
}>;
export type LogoutDto = z.infer<typeof LogoutDtoSchema>;
