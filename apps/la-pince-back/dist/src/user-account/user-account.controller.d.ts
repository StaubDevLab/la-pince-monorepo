import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { UserEntity } from '../decorator/user.decorator';
export declare class UserAccountController {
    private readonly userAccountService;
    constructor(userAccountService: UserAccountService);
    create(createUserAccountDto: CreateUserAccountDto, user: UserEntity): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD";
        accountName: string;
        amount: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD";
        accountName: string;
        amount: number;
    }>;
    findOneByUserId(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD";
        accountName: string;
        amount: number;
    }>;
    update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD";
        accountName: string;
        amount: number;
    }>;
    remove(id: string): Promise<void>;
}
