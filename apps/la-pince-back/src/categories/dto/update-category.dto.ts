import { z } from 'zod';
import { CreateCategorySchema } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

export class UpdateCategoryInput {
    @ApiPropertyOptional({ type: String, minLength: 1, maxLength: 64, example: 'Alimentation' })
    name?: string;
  
    @ApiPropertyOptional({ type: String, pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', example: '#FF5733', description: 'Hex color format: #RRGGBB or #RGB' })
    color?: string;
  
    @ApiPropertyOptional({ type: String, example: 'ShoppingCart', description: 'Nom d\'icône Lucide valide' })
    icon?: string;
  }