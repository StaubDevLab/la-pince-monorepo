"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionSchema = void 0;
const zod_1 = require("zod");
const closest_frequency_1 = require("../../common/validator/closest-frequency");
const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
const budgetFrequency = zod_1.z.enum(budgetFrequencyEnum);
exports.UpdateTransactionSchema = zod_1.z.object({
    transactionType: zod_1.z.preprocess((val) => {
        const num = Number(val);
        return [1, 2].includes(num) ? num : val;
    }, zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2)])).optional(),
    amount: zod_1.z.number().min(0.01, { message: 'Amount must be greater than 0.01' }).optional(),
    date: zod_1.z.string().datetime().or(zod_1.z.string().date()).optional(),
    description: zod_1.z.string().max(500).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    isRecurring: zod_1.z.boolean().optional(),
    recurringFrequency: zod_1.z
        .union([budgetFrequency, zod_1.z.number().int()])
        .optional()
        .nullable()
        .transform((value) => {
        if (typeof value === 'number') {
            return (0, closest_frequency_1.getClosestFrequency)(value);
        }
        return value;
    }),
    recurringEndDate: zod_1.z.string().date().optional().nullable(),
});
//# sourceMappingURL=update-transaction.dto.js.map