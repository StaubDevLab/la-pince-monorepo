import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const DeleteCategorySchema = z.object({
  replaceOldTransactionsCategoryId: z.boolean().optional().default(false),
  newCategoryId: z.string().uuid().optional(),
}).refine((schema) => {
  if (schema.replaceOldTransactionsCategoryId && !schema.newCategoryId) {
    return false;
  }
  return true;
});

export type DeleteCategoryDto = z.infer<typeof DeleteCategorySchema>;

export class DeleteCategoryInput {
  @ApiPropertyOptional({ type: Boolean, default: false, description: 'Si true, remplace les transactions par une autre catégorie' })
  replaceOldTransactionsCategoryId?: boolean;

  @ApiPropertyOptional({ format: 'uuid', description: 'UUID de la catégorie de remplacement (requis si replaceOldTransactionsCategoryId = true)' })
  newCategoryId?: string;
}