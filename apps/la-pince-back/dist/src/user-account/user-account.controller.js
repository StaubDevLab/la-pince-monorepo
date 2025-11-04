"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountController = void 0;
const common_1 = require("@nestjs/common");
const user_account_service_1 = require("./user-account.service");
const create_user_account_dto_1 = require("./dto/create-user-account.dto");
const update_user_account_dto_1 = require("./dto/update-user-account.dto");
const zod_validation_pipe_1 = require("../common/pipes/zod-validation.pipe");
const user_decorator_1 = require("../decorator/user.decorator");
let UserAccountController = class UserAccountController {
    constructor(userAccountService) {
        this.userAccountService = userAccountService;
    }
    create(createUserAccountDto, user) {
        return this.userAccountService.create(createUserAccountDto, user.id);
    }
    findOne(id) {
        return this.userAccountService.findOne(id);
    }
    findOneByUserId(id) {
        return this.userAccountService.findOneByUserId(id);
    }
    update(id, updateUserAccountDto) {
        return this.userAccountService.update(id, updateUserAccountDto);
    }
    remove(id) {
        return this.userAccountService.remove(id);
    }
};
exports.UserAccountController = UserAccountController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(create_user_account_dto_1.CreateUserAccountSchema))),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserAccountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserAccountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserAccountController.prototype, "findOneByUserId", null);
__decorate([
    (0, common_1.Patch)('user/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(update_user_account_dto_1.UpdateUserAccountSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserAccountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserAccountController.prototype, "remove", null);
exports.UserAccountController = UserAccountController = __decorate([
    (0, common_1.Controller)('account'),
    __metadata("design:paramtypes", [user_account_service_1.UserAccountService])
], UserAccountController);
//# sourceMappingURL=user-account.controller.js.map