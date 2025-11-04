"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountModule = void 0;
const common_1 = require("@nestjs/common");
const user_account_service_1 = require("./user-account.service");
const user_account_controller_1 = require("./user-account.controller");
const drizzle_module_1 = require("../db/drizzle/drizzle.module");
const notifications_module_1 = require("../notifications/notifications.module");
let UserAccountModule = class UserAccountModule {
};
exports.UserAccountModule = UserAccountModule;
exports.UserAccountModule = UserAccountModule = __decorate([
    (0, common_1.Module)({
        imports: [drizzle_module_1.DrizzleModule, notifications_module_1.NotificationsModule],
        controllers: [user_account_controller_1.UserAccountController],
        providers: [user_account_service_1.UserAccountService],
        exports: [user_account_service_1.UserAccountService],
    })
], UserAccountModule);
//# sourceMappingURL=user-account.module.js.map