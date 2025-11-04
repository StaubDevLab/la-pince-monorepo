"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMultipleNotificationsSchema = exports.UpdateNotificationSchema = void 0;
const zod_1 = require("zod");
exports.UpdateNotificationSchema = zod_1.z.object({
    isRead: zod_1.z.boolean().optional().default(true),
});
exports.UpdateMultipleNotificationsSchema = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string().uuid()),
    isRead: zod_1.z.boolean().optional().default(true),
});
//# sourceMappingURL=update-notification.dto.js.map