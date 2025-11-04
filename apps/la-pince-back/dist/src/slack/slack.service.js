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
exports.SlackService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const slack_config_1 = require("./slack.config");
const config_1 = require("@nestjs/config");
let SlackService = class SlackService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async postToSlack(message, level = "info") {
        function getSlackColor(level) {
            switch (level) {
                case 'success':
                    return '#2eb886';
                case 'warning':
                    return '#ffcc00';
                case 'error':
                    return '#e01e5a';
                default:
                    return '#439FE0';
            }
        }
        function getTitle(level) {
            switch (level) {
                case 'success':
                    return '✅ Nouvelle notification';
                case 'warning':
                    return '⚠️ Nouvelle notification';
                case 'error':
                    return '🚨 Nouvelle notification';
                default:
                    return 'ℹ️ Nouvelle notification';
            }
        }
        if (!slack_config_1.SlackConfig.token || !slack_config_1.SlackConfig.url || !slack_config_1.SlackConfig.channel) {
            throw new common_1.HttpException("Slack configuration is missing", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const payload = {
            channel: slack_config_1.SlackConfig.channel,
            username: slack_config_1.SlackConfig.botName,
            icon_emoji: slack_config_1.SlackConfig.icon,
            text: message,
            attachments: [
                {
                    color: getSlackColor(level),
                    blocks: [
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: getTitle(level),
                                emoji: true
                            }
                        },
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*${message}*`
                            }
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Voir plus 🔍"
                                    },
                                    url: this.configService.get("FRONTEND_URL") || "http://localhost:3000",
                                    style: "primary"
                                }
                            ]
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: `Posté par <@${slack_config_1.SlackConfig.botName}> - ${new Date().toLocaleString()}`
                                }
                            ]
                        }
                    ]
                }
            ],
        };
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(slack_config_1.SlackConfig.url, payload, {
            headers: {
                Authorization: `Bearer ${slack_config_1.SlackConfig.token}`,
            },
        }));
        if (!response.data.ok) {
            console.error("Slack API error:", response, response.data);
            throw new common_1.HttpException(`Failed to post message to Slack: ${response.data.error}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return;
    }
};
exports.SlackService = SlackService;
exports.SlackService = SlackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], SlackService);
//# sourceMappingURL=slack.service.js.map