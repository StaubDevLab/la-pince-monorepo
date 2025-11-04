"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationSchema = exports.typeEnum = void 0;
const zod_1 = require("zod");
exports.typeEnum = zod_1.z.enum(['transaction', 'budget', 'reminder']);
exports.createNotificationSchema = zod_1.z.object({
    type: exports.typeEnum,
    message: zod_1.z.string(),
    level: zod_1.z.enum(['success', 'info', 'warning', 'error']).default('info'),
});
//# sourceMappingURL=create-notification.dto.js.map