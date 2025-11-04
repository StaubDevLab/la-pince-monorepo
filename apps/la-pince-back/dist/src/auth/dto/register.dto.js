"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDtoSchema = void 0;
const zod_1 = require("zod");
const locale_1 = require("../../db/constants/locale");
exports.RegisterDtoSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).trim(),
    lastName: zod_1.z.string().min(1).trim(),
    email: zod_1.z.string().trim().email(),
    password: zod_1.z
        .string()
        .trim()
        .min(12)
        .refine((password) => /[a-z]/g.test(password ?? ""), 'Password must contain at least one lowercase letter')
        .refine((password) => /[A-Z]/g.test(password ?? ""), 'Password must contain at least one uppercase letter')
        .refine((password) => /[0-9]/g.test(password ?? ""), 'Password must contain at least one digit')
        .refine((password) => /[^a-zA-Z0-9]/g.test(password ?? ""), 'Password must contain at least one special character'),
    accountName: zod_1.z.string().min(1).trim(),
    amount: zod_1.z.number().min(0).default(0),
    locale: zod_1.z.enum(locale_1.locales).optional().default('fr-FR'),
});
//# sourceMappingURL=register.dto.js.map