"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBudgetSchema = void 0;
const zod_1 = require("zod");
const dayjs_1 = __importDefault(require("dayjs"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
const closest_frequency_1 = require("../../common/validator/closest-frequency");
dayjs_1.default.extend(isSameOrBefore_1.default);
const today = (0, dayjs_1.default)().startOf("day").toDate();
const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
const budgetFrequency = zod_1.z.enum(budgetFrequencyEnum);
exports.UpdateBudgetSchema = zod_1.z.object({
    totalAmount: zod_1.z.number().optional(),
    recurringFrequency: zod_1.z
        .union([budgetFrequency, zod_1.z.number().int()])
        .optional()
        .transform((value) => {
        if (typeof value === 'number') {
            return (0, closest_frequency_1.getClosestFrequency)(value);
        }
        return value;
    }),
    recurringStartDate: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.recurringStartDate) {
        return !isNaN(Date.parse(data.recurringStartDate));
    }
    return true;
}, {
    message: "recurringStartDate must be a valid ISO date string",
    path: ["recurringStartDate"],
})
    .refine((data) => {
    if (data.recurringStartDate) {
        return (0, dayjs_1.default)(data.recurringStartDate).startOf("day").isSameOrBefore(today);
    }
    return true;
}, {
    message: "recurringStartDate must be today or in the past",
    path: ["recurringStartDate"],
});
//# sourceMappingURL=update-budget.dto.js.map