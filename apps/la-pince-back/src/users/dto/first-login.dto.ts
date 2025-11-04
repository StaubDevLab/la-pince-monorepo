import { z } from 'zod';
import { locales as localesZones } from 'src/db/constants/locale';
import { currencys } from 'src/db/constants/currency';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const FirstLoginSchema = z.object({
  totalAmount: z.number().min(0, 'Total amount must be a positive number').optional(),
  currency: z.enum(currencys, {
    errorMap: () => ({ message: 'Currency must be a valid currency' }),
  }).optional(),
  accountName: z.string().min(1, 'Account name must be a non-empty string').optional(),
  locale: z.enum(localesZones, {
    errorMap: () => ({ message: 'Locale must be a valid locale' }),
  }).optional(),
});

export type FirstLoginDto = z.infer<typeof FirstLoginSchema>;

// DTO de description pour Swagger (utilisé par @ApiBody)
export class FirstLoginInput {
  @ApiPropertyOptional({ type: Number, minimum: 0, example: 0 })
  totalAmount?: number;

  @ApiPropertyOptional({ type: String, enum: currencys, example: 'EUR' })
  currency?: string;

  @ApiPropertyOptional({ type: String, minLength: 1, example: 'Compte Principal' })
  accountName?: string;

  @ApiPropertyOptional({ type: String, enum: localesZones, example: 'fr-FR' })
  locale?: string;
}