"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstLoginSchema = void 0;
const zod_1 = require("zod");
const locale_1 = require("../../db/constants/locale");
const currency_1 = require("../../db/constants/currency");
exports.FirstLoginSchema = zod_1.z.object({
    totalAmount: zod_1.z.number().min(0, 'Total amount must be a positive number').optional(),
    currency: zod_1.z.enum(currency_1.currencys, {
        errorMap: () => ({ message: 'Currency must be a valid currency' }),
    }).optional(),
    accountName: zod_1.z.string().min(1, 'Account name must be a non-empty string').optional(),
    locale: zod_1.z.enum(locale_1.locales, {
        errorMap: () => ({ message: 'Locale must be a valid locale' }),
    }).optional(),
});
//# sourceMappingURL=first-login.dto.js.map