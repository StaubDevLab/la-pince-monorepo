"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucideIconEnum = void 0;
const lucide_1 = require("lucide");
const zod_1 = require("zod");
exports.LucideIconEnum = zod_1.z.enum([
    ...Object.keys(lucide_1.icons),
], {
    message: 'Invalid icon. The icon must be a valid Lucide icon',
});
//# sourceMappingURL=lucide-icon.schema.js.map