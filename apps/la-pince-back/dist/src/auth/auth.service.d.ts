import { UsersService } from "../users/users.service";
import { UserAccountService } from 'src/user-account/user-account.service';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as schema from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MailService } from 'src/mail/mail.service';
import { oauth2_v2 } from 'googleapis';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly userAccountService;
    private readonly db;
    private readonly mailService;
    constructor(usersService: UsersService, jwtService: JwtService, userAccountService: UserAccountService, db: NodePgDatabase<typeof schema>, mailService: MailService);
    private readonly logger;
    signUp(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            accountName: string;
            amount: number;
            firstLogin: boolean;
            avatar: string;
            locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
            verifiedEmail: boolean;
            currency: string;
        };
        sessionId: string;
        accessToken: string;
        accessTokenExpiresAt: Date;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    }>;
    login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            accountName: string;
            amount: number;
            firstLogin: boolean;
            avatar: string;
            locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
            verifiedEmail: boolean;
            currency: string;
        };
        sessionId: string;
        accessToken: string;
        accessTokenExpiresAt: Date;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    }>;
    googleAuth(googleUser: oauth2_v2.Schema$Userinfo, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            accountName: string;
            amount: number;
            firstLogin: boolean;
            avatar: string;
            locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT";
            verifiedEmail: boolean;
            currency: string;
        };
        sessionId: string;
        accessToken: string;
        accessTokenExpiresAt: Date;
        refreshToken: string;
        refreshTokenExpiresAt: Date;
    }>;
    private createToken;
    private createRefreshToken;
    refreshAccessToken(refreshToken: string, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        accessTokenExpiresAt: Date;
    }>;
    logout(sessionId: string): Promise<{
        message: string;
    }>;
    removeRevokedSessions(): Promise<{
        message: string;
    }>;
    handleCron(): Promise<void>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
