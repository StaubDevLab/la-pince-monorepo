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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackController = void 0;
const common_1 = require("@nestjs/common");
const slack_service_1 = require("./slack.service");
let SlackController = class SlackController {
    constructor(slackService) {
        this.slackService = slackService;
    }
    async postToSlack() {
        const message = "Hello from NestJS!";
        return this.slackService.postToSlack(message);
    }
};
exports.SlackController = SlackController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SlackController.prototype, "postToSlack", null);
exports.SlackController = SlackController = __decorate([
    (0, common_1.Controller)('slack'),
    __metadata("design:paramtypes", [slack_service_1.SlackService])
], SlackController);
//# sourceMappingURL=slack.controller.js.map