import { z } from 'zod';
import { locales as localesZones } from '../../db/constants/locale';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  locale: z.enum(localesZones).optional(),
  avatar: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;


export class UpdateUserInput {
  @ApiPropertyOptional({ type: String, format: 'email', example: 'john.doe@example.com' })
  email?: string;

  @ApiPropertyOptional({ type: String, example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ type: String, example: 'Doe' })
  lastName?: string;

  @ApiPropertyOptional({ type: String, enum: localesZones, example: 'fr-FR' })
  locale?: string;

  @ApiPropertyOptional({ type: String, description: 'URL de l\'avatar', example: 'https://example.com/avatar.jpg' })
  avatar?: string;
}