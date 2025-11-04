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
exports.GoogleController = void 0;
const common_1 = require("@nestjs/common");
const google_oauth_service_1 = require("./google-oauth.service");
const auth_service_1 = require("../auth/auth.service");
let GoogleController = class GoogleController {
    constructor(googleService, authService) {
        this.googleService = googleService;
        this.authService = authService;
    }
    async googleAuth() {
        return this.googleService.getOAuth2ClientUrl();
    }
    async googleAuthCallback(code) {
        const { userData, refreshToken, accessToken } = await this.googleService.getAuthClientData(code);
        if (!userData || !userData.email) {
            throw new Error('Failed to retrieve user data from Google');
        }
        const user = await this.authService.googleAuth(userData);
        return { url: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/dashboard' };
    }
};
exports.GoogleController = GoogleController;
__decorate([
    (0, common_1.Get)('google-auth'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google-callback'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoogleController.prototype, "googleAuthCallback", null);
exports.GoogleController = GoogleController = __decorate([
    (0, common_1.Controller)('google-oauth'),
    __metadata("design:paramtypes", [google_oauth_service_1.GoogleService,
        auth_service_1.AuthService])
], GoogleController);
//# sourceMappingURL=google-oauth.controller.js.map