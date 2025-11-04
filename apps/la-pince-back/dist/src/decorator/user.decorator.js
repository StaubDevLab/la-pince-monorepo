"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.id) {
        throw new common_1.BadRequestException('User not found');
    }
    const schema = zod_1.z.string().uuid();
    const accountId = schema.safeParse(user.id);
    if (!accountId.success) {
        throw new common_1.BadRequestException('Invalid account ID');
    }
    return user;
});
//# sourceMappingURL=user.decorator.js.map