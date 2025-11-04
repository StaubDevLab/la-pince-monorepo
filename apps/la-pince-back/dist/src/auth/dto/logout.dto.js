"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutDtoSchema = void 0;
const zod_1 = require("zod");
exports.LogoutDtoSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
}).strict();
//# sourceMappingURL=logout.dto.js.map