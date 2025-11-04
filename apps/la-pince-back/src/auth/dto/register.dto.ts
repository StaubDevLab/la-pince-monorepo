import { z } from 'zod';
import { locales as localesZone } from '../../db/constants/locale'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export const RegisterDtoSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .min(12)
    .refine((password) => /[a-z]/g.test(password ?? ""), 'Password must contain at least one lowercase letter')
    .refine((password) => /[A-Z]/g.test(password ?? ""), 'Password must contain at least one uppercase letter')
    .refine((password) => /[0-9]/g.test(password ?? ""), 'Password must contain at least one digit')
    .refine((password) => /[^a-zA-Z0-9]/g.test(password ?? ""), 'Password must contain at least one special character'),
  accountName: z.string().min(1).trim(),
  amount: z.number().min(0).default(0),
  locale: z.enum(localesZone).optional().default('fr-FR'),
})

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export class RegisterInput {
  @ApiProperty({ type: String, minLength: 1, example: 'John' })
  firstName!: string;

  @ApiProperty({ type: String, minLength: 1, example: 'Doe' })
  lastName!: string;

  @ApiProperty({ type: String, format: 'email', example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ type: String, minLength: 12, description: 'Doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial', example: 'SecurePass123!' })
  password!: string;

  @ApiProperty({ type: String, minLength: 1, example: 'Compte Principal' })
  accountName!: string;

  @ApiPropertyOptional({ type: Number, minimum: 0, default: 0, example: 0 })
  amount?: number;

  @ApiPropertyOptional({ type: String, enum: localesZone, default: 'fr-FR', example: 'fr-FR' })
  locale?: string;
}