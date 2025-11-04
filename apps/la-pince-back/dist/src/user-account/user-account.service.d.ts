import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
export declare class UserAccountService {
    private readonly db;
    private readonly notificationsService;
    private readonly i18n;
    private readonly logger;
    constructor(db: NodePgDatabase<typeof schema>, notificationsService: NotificationsService, i18n: I18nService<I18nTranslations>);
    create(createUserAccountDto: CreateUserAccountDto, userId: string): Promise<schema.UserAccount>;
    findAll(): Promise<schema.UserAccount[]>;
    findOne(id: string): Promise<schema.UserAccount>;
    findOneByUserId(userId: string): Promise<schema.UserAccount>;
    update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<schema.UserAccount>;
    updateTotalAmount(userId: string, type: number, amount: number): Promise<schema.UserAccount>;
    remove(id: string): Promise<void>;
}
