import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto, UpdateMultipleNotificationsDto } from './dto/update-notification.dto';
import { UserEntity } from '../decorator/user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: UserEntity, isRead?: boolean, page?: number, limit?: number): Promise<{
        data: import("../db/schema").Notification[];
        limit: number;
        page: number;
        total: number;
    }>;
    findOne(id: string, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: "transaction" | "budget" | "reminder";
        message: string;
        level: "success" | "info" | "warning" | "error";
        isRead: boolean;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: "transaction" | "budget" | "reminder";
        message: string;
        level: "success" | "info" | "warning" | "error";
        isRead: boolean;
    }>;
    updateMultiple(updateNotificationDto: UpdateMultipleNotificationsDto, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: "transaction" | "budget" | "reminder";
        message: string;
        level: "success" | "info" | "warning" | "error";
        isRead: boolean;
    }[]>;
    remove(id: string, user: UserEntity): Promise<void>;
}
