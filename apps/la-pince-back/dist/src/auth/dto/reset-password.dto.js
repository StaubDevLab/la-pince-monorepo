"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.ResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    newPassword: zod_1.z
        .string()
        .trim()
        .min(12)
        .refine((password) => /[a-z]/g.test(password ?? ""), 'Password must contain at least one lowercase letter')
        .refine((password) => /[A-Z]/g.test(password ?? ""), 'Password must contain at least one uppercase letter')
        .refine((password) => /[0-9]/g.test(password ?? ""), 'Password must contain at least one digit')
        .refine((password) => /[^a-zA-Z0-9]/g.test(password ?? ""), 'Password must contain at least one special character'),
    confirmNewPassword: zod_1.z.string().min(12, 'Confirm password must be at least 12 characters long'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
});
//# sourceMappingURL=reset-password.dto.js.map