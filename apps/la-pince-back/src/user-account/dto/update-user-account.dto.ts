import { z } from 'zod';
import { CreateUserAccountSchema } from './create-user-account.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateUserAccountSchema = CreateUserAccountSchema.partial();

export type UpdateUserAccountDto = z.infer<typeof UpdateUserAccountSchema>;


export class UpdateUserAccountInput {
  @ApiPropertyOptional({ type: String, example: 'Compte Principal' })
  accountName?: string;

  @ApiPropertyOptional({ type: Number, example: 0 })
  amount?: number;

  @ApiPropertyOptional({ type: String, enum: ['EUR', 'USD', 'GBP'], example: 'EUR' })
  currency?: string;
}