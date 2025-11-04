"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserAccountService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const notifications_service_1 = require("../notifications/notifications.service");
const nestjs_i18n_1 = require("nestjs-i18n");
let UserAccountService = UserAccountService_1 = class UserAccountService {
    constructor(db, notificationsService, i18n) {
        this.db = db;
        this.notificationsService = notificationsService;
        this.i18n = i18n;
        this.logger = new common_1.Logger(UserAccountService_1.name);
    }
    async create(createUserAccountDto, userId) {
        const result = await this.db.insert(schema.userAccounts).values({
            userId,
            ...createUserAccountDto,
            createdAt: new Date(),
        }).returning();
        return result[0];
    }
    async findAll() {
        return this.db.select().from(schema.userAccounts);
    }
    async findOne(id) {
        const result = await this.db.select().from(schema.userAccounts).where((0, drizzle_orm_1.eq)(schema.userAccounts.id, id));
        return result[0];
    }
    async findOneByUserId(userId) {
        const result = await this.db.select().from(schema.userAccounts).where((0, drizzle_orm_1.eq)(schema.userAccounts.userId, userId));
        return result[0];
    }
    async update(id, updateUserAccountDto) {
        const existingAccount = await this.findOneByUserId(id);
        if (!existingAccount) {
            throw new common_1.NotFoundException('User account not found');
        }
        const result = await this.db.update(schema.userAccounts).set({
            ...updateUserAccountDto,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema.userAccounts.id, existingAccount.id)).returning();
        return result[0];
    }
    async updateTotalAmount(userId, type, amount) {
        const userAccount = await this.findOneByUserId(userId);
        if (!userAccount) {
            throw new common_1.NotFoundException('User account not found');
        }
        const totalAmount = userAccount.amount + (type === 1 ? amount : -amount);
        const result = await this.db.update(schema.userAccounts).set({
            amount: totalAmount,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema.userAccounts.userId, userId)).returning();
        if (result[0].amount < 0) {
            try {
                await this.notificationsService.create({
                    level: 'warning',
                    type: 'reminder',
                    message: this.i18n.t('common.USERACCOUNT.negativeBalance', { args: { amount: result[0].amount + ' ' + result[0].currency }, lang: nestjs_i18n_1.I18nContext.current()?.lang || 'en' }),
                }, userId);
            }
            catch (error) {
                this.logger.error('Error sending notification:', error);
            }
        }
        return result[0];
    }
    async remove(id) {
        return this.db.delete(schema.userAccounts).where((0, drizzle_orm_1.eq)(schema.userAccounts.id, id));
    }
};
exports.UserAccountService = UserAccountService;
exports.UserAccountService = UserAccountService = UserAccountService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(2, (0, common_1.Inject)(nestjs_i18n_1.I18nService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        notifications_service_1.NotificationsService,
        nestjs_i18n_1.I18nService])
], UserAccountService);
//# sourceMappingURL=user-account.service.js.map