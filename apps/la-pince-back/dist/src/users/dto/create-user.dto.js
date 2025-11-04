"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const locale_1 = require("../../db/constants/locale");
const accountTypes = zod_1.z.enum(['in-app', 'google']);
const locales = zod_1.z.enum(locale_1.locales);
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    password: zod_1.z
        .string()
        .trim()
        .min(12)
        .refine((password) => /[a-z]/g.test(password ?? ""), 'Password must contain at least one lowercase letter')
        .refine((password) => /[A-Z]/g.test(password ?? ""), 'Password must contain at least one uppercase letter')
        .refine((password) => /[0-9]/g.test(password ?? ""), 'Password must contain at least one digit')
        .refine((password) => /[^a-zA-Z0-9]/g.test(password ?? ""), 'Password must contain at least one special character'),
    accountType: accountTypes.optional().default('in-app'),
    locale: locales.optional().default('fr-FR'),
    avatar: zod_1.z.string().optional()
});
//# sourceMappingURL=create-user.dto.js.map