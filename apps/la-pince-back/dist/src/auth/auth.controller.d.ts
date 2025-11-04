import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, request: Request): Promise<{
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
    login(loginDto: LoginDto, request: Request): Promise<{
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
    refreshToken(body: RefreshDto, request: Request): Promise<{
        accessToken: string;
        accessTokenExpiresAt: Date;
    }>;
    logout(body: LogoutDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
