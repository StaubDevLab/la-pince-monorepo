"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackConfig = void 0;
exports.SlackConfig = {
    channel: process.env.SLACK_CHANNEL || 'general',
    token: process.env.SLACK_BOT_TOKEN,
    botName: process.env.SLACK_BOT_NAME || 'La Pince Bot',
    icon: ':computer:',
    url: 'https://slack.com/api/chat.postMessage',
};
//# sourceMappingURL=slack.config.js.map