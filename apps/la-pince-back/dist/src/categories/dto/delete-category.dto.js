"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCategorySchema = void 0;
const zod_1 = require("zod");
exports.DeleteCategorySchema = zod_1.z.object({
    replaceOldTransactionsCategoryId: zod_1.z.boolean().optional().default(false),
    newCategoryId: zod_1.z.string().uuid().optional(),
}).refine((schema) => {
    if (schema.replaceOldTransactionsCategoryId && !schema.newCategoryId) {
        return false;
    }
    return true;
});
//# sourceMappingURL=delete-category.dto.js.map