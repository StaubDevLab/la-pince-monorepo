"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("./db/drizzle/drizzle.module");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const auth_middleware_1 = require("./auth/auth.middleware");
const user_account_module_1 = require("./user-account/user-account.module");
const budget_module_1 = require("./budget/budget.module");
const transactions_module_1 = require("./transactions/transactions.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
const bullmq_1 = require("@nestjs/bullmq");
const budget_reset_module_1 = require("./lib/bullmq/budget-reset/budget-reset.module");
const schedule_1 = require("@nestjs/schedule");
const mail_module_1 = require("./mail/mail.module");
const home_module_1 = require("./home/home.module");
const slack_module_1 = require("./slack/slack.module");
const nestjs_1 = require("@bull-board/nestjs");
const express_1 = require("@bull-board/express");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const nestjs_i18n_1 = require("nestjs-i18n");
const path_1 = require("path");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .exclude({ path: 'auth/signup', method: common_1.RequestMethod.POST }, { path: 'auth/signin', method: common_1.RequestMethod.POST }, { path: 'auth/token/refresh', method: common_1.RequestMethod.POST }, { path: 'swagger/{*splat}', method: common_1.RequestMethod.GET }, { path: 'auth/forgot-password', method: common_1.RequestMethod.POST }, { path: 'auth/reset-password', method: common_1.RequestMethod.POST }, { path: '/admin/queues', method: common_1.RequestMethod.ALL }, { path: 'google-oauth/google-auth', method: common_1.RequestMethod.GET }, { path: 'google-oauth/google-callback', method: common_1.RequestMethod.GET })
            .forRoutes({
            path: '*splat',
            method: common_1.RequestMethod.ALL,
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            bullmq_1.BullModule.forRootAsync({
                useFactory: async () => ({
                    connection: {
                        host: process.env.CACHE_HOST,
                        port: parseInt(process.env.CACHE_PORT ?? "6379", 10) || 6379,
                        password: process.env.CACHE_PASSWORD,
                        db: parseInt(process.env.CACHE_DB ?? "0", 10) || 0,
                    },
                }),
            }),
            nestjs_1.BullBoardModule.forRoot({
                adapter: express_1.ExpressAdapter,
                route: '/admin/queues',
                middleware: (0, express_basic_auth_1.default)({
                    challenge: true,
                    users: { admin: "admin" },
                }),
            }),
            nestjs_i18n_1.I18nModule.forRootAsync({
                useFactory: (config) => ({
                    fallbackLanguage: 'en',
                    fallbacks: {
                        'fr-*': 'fr',
                        'en-*': 'en',
                    },
                    loaderOptions: {
                        path: (0, path_1.join)(__dirname, '..', '/i18n/'),
                        watch: config.get('NODE_ENV') !== 'production',
                    },
                    typesOutputPath: (0, path_1.join)(process.cwd(), '/src/generated/i18n.generated.ts'),
                    disableMiddleware: true,
                }),
                resolvers: [
                    new nestjs_i18n_1.HeaderResolver(["x-custom-lang"]),
                ],
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            drizzle_module_1.DrizzleModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            user_account_module_1.UserAccountModule,
            budget_module_1.BudgetModule,
            transactions_module_1.TransactionsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            budget_reset_module_1.BudgetResetModule,
            mail_module_1.MailModule,
            home_module_1.HomeModule,
            slack_module_1.SlackModule.register({
                enable: process.env.SLACK_ENABLED === 'true',
                isGlobal: true,
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map