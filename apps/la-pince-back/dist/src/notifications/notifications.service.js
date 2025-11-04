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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const slack_service_1 = require("../slack/slack.service");
let NotificationsService = class NotificationsService {
    constructor(db, slackService) {
        this.db = db;
        this.slackService = slackService;
    }
    async create(createNotificationDto, userId) {
        const notification = await this.db.insert(schema.notifications).values({
            ...createNotificationDto,
            userId,
            createdAt: new Date(),
        }).returning();
        if (this.slackService) {
            const user = await this.db.select().from(schema.users).where((0, drizzle_orm_1.eq)(schema.users.id, userId)).then((users) => users[0]);
            await this.slackService.postToSlack(`${user ? user.firstName + ' ' + user.lastName : 'unknown'}: ${createNotificationDto.message}`, createNotificationDto.level);
        }
        return notification[0];
    }
    async findAll(userId, isRead, limit, page) {
        const conditions = [(0, drizzle_orm_1.eq)(schema.notifications.userId, userId)];
        if (!isRead) {
            conditions.push((0, drizzle_orm_1.eq)(schema.notifications.isRead, false));
        }
        const result = await this.db
            .select()
            .from(schema.notifications)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema.notifications.createdAt))
            .limit(limit)
            .offset(page * limit);
        const totalCount = await this.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema.notifications)
            .where((0, drizzle_orm_1.and)(...conditions));
        return {
            data: result,
            limit,
            page,
            total: totalCount[0].count,
        };
    }
    async findOne(id, userId) {
        const result = await this.db.select().from(schema.notifications).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.id, id), (0, drizzle_orm_1.eq)(schema.notifications.userId, userId)));
        if (result.length === 0) {
            throw new common_1.BadRequestException('Notification not found');
        }
        return result[0];
    }
    async update(id, updateNotificationDto, userId) {
        const notification = await this.findOne(id, userId);
        if (notification.isRead) {
            throw new common_1.BadRequestException('Notification already read');
        }
        const result = await this.db.update(schema.notifications).set({
            ...updateNotificationDto,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.id, id), (0, drizzle_orm_1.eq)(schema.notifications.userId, userId))).returning();
        return result[0];
    }
    async updateMultiple(updateNotificationDto, userId) {
        if (updateNotificationDto.ids.length === 0) {
            throw new common_1.BadRequestException('No notification IDs provided');
        }
        const notifications = await this.db
            .select()
            .from(schema.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.userId, userId), (0, drizzle_orm_1.inArray)(schema.notifications.id, updateNotificationDto.ids)));
        if (notifications.length !== updateNotificationDto.ids.length) {
            throw new common_1.BadRequestException('Some notifications not found or do not belong to the user');
        }
        const result = await this.db
            .update(schema.notifications)
            .set({
            isRead: updateNotificationDto.isRead,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.userId, userId), (0, drizzle_orm_1.inArray)(schema.notifications.id, updateNotificationDto.ids)))
            .returning();
        return result;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.db
            .delete(schema.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.id, id), (0, drizzle_orm_1.eq)(schema.notifications.userId, userId)))
            .then(() => undefined);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(slack_service_1.SlackService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        slack_service_1.SlackService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map