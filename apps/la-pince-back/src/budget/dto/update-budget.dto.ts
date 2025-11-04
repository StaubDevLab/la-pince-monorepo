import { z } from "zod";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getClosestFrequency } from "src/common/validator/closest-frequency";
import { ApiPropertyOptional } from '@nestjs/swagger';
dayjs.extend(isSameOrBefore);

const today = dayjs().startOf("day").toDate();

const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'] as const;
const budgetFrequency = z.enum(budgetFrequencyEnum);

export const UpdateBudgetSchema = z.object({
  totalAmount: z.number().optional(),
  recurringFrequency: z
    .union([budgetFrequency, z.number().int()])
    .optional()
    .transform((value) => {
      if (typeof value === 'number') {
        return getClosestFrequency(value);
      }
      return value;
    }),
  recurringStartDate: z.string().optional(),
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
    return dayjs(data.recurringStartDate).startOf("day").isSameOrBefore(today);
  }
  return true;
}, {
  message: "recurringStartDate must be today or in the past",
  path: ["recurringStartDate"],
});

export type UpdateBudgetDto = z.infer<typeof UpdateBudgetSchema>;

export class UpdateBudgetInput {
  @ApiPropertyOptional({ type: Number, description: 'Montant total du budget' })
  totalAmount?: number;

  @ApiPropertyOptional({ enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'], description: 'Fréquence de réinitialisation du budget' })
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | number;

  @ApiPropertyOptional({ type: String, description: 'Date de début ISO (doit être aujourd\'hui ou dans le passé)' })
  recurringStartDate?: string;
}