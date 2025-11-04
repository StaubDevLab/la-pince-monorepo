"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoogleModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleModule = void 0;
const common_1 = require("@nestjs/common");
const google_oauth_service_1 = require("./google-oauth.service");
const config_1 = require("@nestjs/config");
const google_oauth_controller_1 = require("./google-oauth.controller");
const auth_module_1 = require("../auth/auth.module");
let GoogleModule = GoogleModule_1 = class GoogleModule {
    static forRoot(options = { enabled: false }) {
        if (!options.enabled) {
            return {
                module: GoogleModule_1,
                imports: [config_1.ConfigModule],
                providers: [],
                controllers: [],
                exports: [],
            };
        }
        return {
            module: GoogleModule_1,
            imports: [config_1.ConfigModule, auth_module_1.AuthModule],
            providers: [google_oauth_service_1.GoogleService],
            controllers: [google_oauth_controller_1.GoogleController],
            exports: [google_oauth_service_1.GoogleService],
        };
    }
};
exports.GoogleModule = GoogleModule;
exports.GoogleModule = GoogleModule = GoogleModule_1 = __decorate([
    (0, common_1.Module)({})
], GoogleModule);
//# sourceMappingURL=google-oauth.module.js.map