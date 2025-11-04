import { z } from 'zod';
export declare const DeleteCategorySchema: z.ZodEffects<z.ZodObject<{
    replaceOldTransactionsCategoryId: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    newCategoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    replaceOldTransactionsCategoryId: boolean;
    newCategoryId?: string | undefined;
}, {
    replaceOldTransactionsCategoryId?: boolean | undefined;
    newCategoryId?: string | undefined;
}>, {
    replaceOldTransactionsCategoryId: boolean;
    newCategoryId?: string | undefined;
}, {
    replaceOldTransactionsCategoryId?: boolean | undefined;
    newCategoryId?: string | undefined;
}>;
export type DeleteCategoryDto = z.infer<typeof DeleteCategorySchema>;
