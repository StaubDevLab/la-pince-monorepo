"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SlackModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackModule = void 0;
const common_1 = require("@nestjs/common");
const slack_service_1 = require("./slack.service");
const slack_controller_1 = require("./slack.controller");
const axios_1 = require("@nestjs/axios");
let SlackModule = SlackModule_1 = class SlackModule {
    static register(options = {}) {
        const providers = options.enable ? [slack_service_1.SlackService] : [];
        const controllers = options.enable ? [slack_controller_1.SlackController] : [];
        return {
            global: options.isGlobal,
            module: SlackModule_1,
            imports: [
                axios_1.HttpModule.register({
                    timeout: 5000,
                    maxRedirects: 5,
                }),
            ],
            providers,
            controllers,
            exports: providers,
        };
    }
};
exports.SlackModule = SlackModule;
exports.SlackModule = SlackModule = SlackModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], SlackModule);
//# sourceMappingURL=slack.module.js.map