"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserAccountSchema = void 0;
const zod_1 = require("zod");
const currency_1 = require("../../db/constants/currency");
exports.CreateUserAccountSchema = zod_1.z.object({
    accountName: zod_1.z.string().trim(),
    amount: zod_1.z.number(),
    currency: zod_1.z.enum(currency_1.currencys, {
        errorMap: () => ({ message: 'Currency must be a valid currency' }),
    }).optional(),
});
//# sourceMappingURL=create-user-account.dto.js.map