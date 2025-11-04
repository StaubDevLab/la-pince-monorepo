import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirstLoginDto } from './dto/first-login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '../decorator/user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    firstLogin(firstLoginDto: FirstLoginDto, user: UserEntity): Promise<{
        password: string;
        locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accountType: "in-app" | "google";
        avatar: string;
        firstLogin: boolean;
        verifiedEmail: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(user: UserEntity): Promise<{
        password: string;
        locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accountType: "in-app" | "google";
        avatar: string;
        firstLogin: boolean;
        verifiedEmail: boolean;
        createdAt: Date;
        updatedAt: Date;
    } & {
        accountId: string;
        accountName: string;
        amount: number;
    }>;
    update(updateUserDto: UpdateUserDto, user: UserEntity): Promise<{
        password: string;
        locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        accountType: "in-app" | "google";
        avatar: string;
        firstLogin: boolean;
        verifiedEmail: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePassword(updateUserDto: UpdatePasswordDto, user: UserEntity): Promise<{
        message: string;
    }>;
}
