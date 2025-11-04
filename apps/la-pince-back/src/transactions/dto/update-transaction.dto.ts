import { z } from 'zod';
import { getClosestFrequency } from 'src/common/validator/closest-frequency';
import { ApiPropertyOptional } from '@nestjs/swagger';

const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'] as const;
const budgetFrequency = z.enum(budgetFrequencyEnum);

export const UpdateTransactionSchema = z.object({
  transactionType: z.preprocess((val) => {
    const num = Number(val);
    return [1, 2].includes(num) ? num : val;
  }, z.union([z.literal(1), z.literal(2)])).optional(),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0.01' }).optional(),
  date: z.string().datetime().or(z.string().date()).optional(),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z
    .union([budgetFrequency, z.number().int()])
    .optional()
    .nullable()
    .transform((value) => {
      if (typeof value === 'number') {
        return getClosestFrequency(value);
      }
      return value;
    }),
  recurringEndDate: z.string().date().optional().nullable(),
})

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;

export class UpdateTransactionInput {
  @ApiPropertyOptional({ enum: [1, 2], description: '1 = expense, 2 = income' })
  transactionType?: 1 | 2;

  @ApiPropertyOptional({ type: Number, minimum: 0.01 })
  amount?: number;

  @ApiPropertyOptional({ type: String, description: 'ISO date string (YYYY-MM-DD or ISO datetime)' })
  date?: string;

  @ApiPropertyOptional({ type: String, maxLength: 500 })
  description?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  categoryId?: string;

  @ApiPropertyOptional({ type: Boolean })
  isRecurring?: boolean;

  @ApiPropertyOptional({ enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'] })
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | number | null;

  @ApiPropertyOptional({ type: String, description: 'ISO date string', nullable: true })
  recurringEndDate?: string | null;
}