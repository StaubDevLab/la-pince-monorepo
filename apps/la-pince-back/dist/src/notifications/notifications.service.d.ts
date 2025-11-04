import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto, UpdateMultipleNotificationsDto } from './dto/update-notification.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { SlackService } from 'src/slack/slack.service';
export declare class NotificationsService {
    private readonly db;
    private readonly slackService?;
    constructor(db: NodePgDatabase<typeof schema>, slackService?: SlackService | undefined);
    create(createNotificationDto: CreateNotificationDto, userId: string): Promise<schema.Notification>;
    findAll(userId: string, isRead: boolean, limit: number, page: number): Promise<{
        data: schema.Notification[];
        limit: number;
        page: number;
        total: number;
    }>;
    findOne(id: string, userId: string): Promise<schema.Notification>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, userId: string): Promise<schema.Notification>;
    updateMultiple(updateNotificationDto: UpdateMultipleNotificationsDto, userId: string): Promise<schema.Notification[]>;
    remove(id: string, userId: string): Promise<void>;
}
