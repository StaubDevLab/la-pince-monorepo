import { z } from 'zod';
import { currencys } from 'src/db/constants/currency';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CreateUserAccountSchema = z.object({
  accountName: z.string().trim(),
  amount: z.number(),
  currency: z.enum(currencys, {
    errorMap: () => ({ message: 'Currency must be a valid currency' }),
  }).optional(),
})

export type CreateUserAccountDto = z.infer<typeof CreateUserAccountSchema>;

export class CreateUserAccountInput {
  @ApiProperty({ type: String, example: 'Compte Principal' })
  accountName!: string;

  @ApiProperty({ type: Number, example: 0 })
  amount!: number;

  @ApiPropertyOptional({ type: String, enum: currencys, example: 'EUR' })
  currency?: string;
}