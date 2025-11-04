"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
const lucide_icon_schema_1 = require("../../common/validator/lucide-icon.schema");
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(64),
    color: zod_1.z.string().min(1).max(10).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Invalid hex color. Expected format: #RRGGBB or #RGB",
    }),
    icon: lucide_icon_schema_1.LucideIconEnum,
});
//# sourceMappingURL=create-category.dto.js.map