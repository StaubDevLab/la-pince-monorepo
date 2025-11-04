import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { UserAccountService } from 'src/user-account/user-account.service';
import { FirstLoginDto } from './dto/first-login.dto';
export declare class UsersService {
    private db;
    private readonly userAccountService;
    constructor(db: NodePgDatabase<typeof schema>, userAccountService: UserAccountService);
    create(createUserDto: CreateUserDto): Promise<schema.User>;
    findAll(): Promise<schema.User[]>;
    findOne(id: string): Promise<schema.User & {
        accountId: string;
        accountName: string;
        amount: number;
    }>;
    findByEmail(email: string): Promise<(schema.User & {
        accountId: string;
        accountName: string;
        amount: number;
        currency: string;
    }) | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<schema.User>;
    firstLogin(firstLoginDto: FirstLoginDto, userId: string): Promise<schema.User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
