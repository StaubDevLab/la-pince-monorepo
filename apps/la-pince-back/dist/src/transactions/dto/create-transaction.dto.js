"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionSchema = void 0;
const zod_1 = require("zod");
const closest_frequency_1 = require("../../common/validator/closest-frequency");
const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
const budgetFrequency = zod_1.z.enum(budgetFrequencyEnum);
exports.CreateTransactionSchema = zod_1.z.object({
    transactionType: zod_1.z.preprocess((val) => {
        const num = Number(val);
        return [1, 2].includes(num) ? num : val;
    }, zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2)])),
    amount: zod_1.z.number().min(0.01, { message: 'Amount must be greater than 0.01' }),
    date: zod_1.z.string().datetime().or(zod_1.z.string().date()),
    description: zod_1.z.string().max(500).optional(),
    categoryId: zod_1.z.string().uuid(),
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
    recurringEndDate: zod_1.z.string().datetime().or(zod_1.z.string().date()).optional().nullable(),
}).refine((data) => {
    if (data.isRecurring === true) {
        if (!data.recurringFrequency || data.recurringFrequency === null) {
            return false;
        }
    }
    return true;
}, {
    message: 'If the transaction is recurring, recurringFrequency and date must be provided.',
}).refine((data) => {
    if (data.date && data.recurringEndDate) {
        return new Date(data.date) < new Date(data.recurringEndDate);
    }
    return true;
}, {
    message: 'If recurringEndDate is provided, it must be after recurringStartDate.',
});
//# sourceMappingURL=create-transaction.dto.js.map