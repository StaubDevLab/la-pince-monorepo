"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
const locale_1 = require("../../db/constants/locale");
exports.UpdateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    locale: zod_1.z.enum(locale_1.locales).optional(),
    avatar: zod_1.z.string().optional(),
});
//# sourceMappingURL=update-user.dto.js.map