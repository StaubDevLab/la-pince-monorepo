"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const mailer_1 = require("@nestjs-modules/mailer");
const pug_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/pug.adapter");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                useFactory: () => {
                    const transportOptions = {
                        host: process.env.SMTP_HOST,
                        port: parseInt(process.env.SMTP_PORT || "587", 10),
                        secure: process.env.SMTP_SECURE === 'true',
                        tls: {
                            rejectUnauthorized: false,
                        },
                    };
                    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
                        transportOptions.auth = {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASSWORD,
                        };
                    }
                    return {
                        transport: transportOptions,
                        defaults: {
                            from: process.env.SMTP_FROM,
                        },
                        template: {
                            dir: __dirname + '../../../templates',
                            adapter: new pug_adapter_1.PugAdapter(),
                            options: { strict: true },
                        },
                    };
                },
            }),
        ],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map