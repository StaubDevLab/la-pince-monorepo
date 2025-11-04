import { z } from 'zod';
import { LucideIconEnum } from 'src/common/validator/lucide-icon.schema';
import { ApiProperty } from '@nestjs/swagger';

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(64),
  color: z.string().min(1).max(10).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Invalid hex color. Expected format: #RRGGBB or #RGB",
  }),
  icon: LucideIconEnum,
})

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export class CreateCategoryInput {
  @ApiProperty({ type: String, minLength: 1, maxLength: 64, example: 'Alimentation' })
  name!: string;

  @ApiProperty({ type: String, pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', example: '#FF5733', description: 'Hex color format: #RRGGBB or #RGB' })
  color!: string;

  @ApiProperty({ type: String, example: 'ShoppingCart', description: 'Nom d\'icône Lucide valide' })
  icon!: string;
}