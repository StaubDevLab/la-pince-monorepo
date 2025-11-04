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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const user_account_service_1 = require("../user-account/user-account.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
const schema = __importStar(require("../db/schema"));
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const ms_1 = __importDefault(require("ms"));
const constants_1 = require("./constants");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const schedule_1 = require("@nestjs/schedule");
const mail_service_1 = require("../mail/mail.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, userAccountService, db, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.userAccountService = userAccountService;
        this.db = db;
        this.mailService = mailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signUp(registerDto, ipAddress, userAgent) {
        const user = await this.usersService.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
            password: registerDto.password,
            accountType: 'in-app',
            locale: registerDto.locale || 'fr-FR',
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const userAccount = await this.userAccountService.create({
            accountName: registerDto.accountName,
            amount: registerDto.amount,
        }, user.id);
        const data = {
            ...user,
            userAccountId: userAccount.id,
            accountName: userAccount.accountName,
            amount: userAccount.amount,
            currency: userAccount.currency || 'EUR',
        };
        return this.createToken(data, ipAddress, userAgent);
    }
    async login(email, password, ipAddress, userAgent) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.createToken(user, ipAddress, userAgent);
    }
    async googleAuth(googleUser, ipAddress, userAgent) {
        if (!googleUser.email) {
            throw new common_1.UnauthorizedException('Google user email is required');
        }
        const user = await this.usersService.findByEmail(googleUser.email);
        if (!user) {
            const newUser = await this.usersService.create({
                firstName: googleUser.given_name || '',
                lastName: googleUser.family_name || '',
                email: googleUser.email,
                password: (0, uuid_1.v4)(),
                accountType: 'google',
                locale: 'fr-FR',
                avatar: googleUser.picture || undefined,
            });
            if (!newUser) {
                throw new common_1.UnauthorizedException('Failed to create user');
            }
            const userAccount = await this.userAccountService.create({
                accountName: 'Default Account',
                amount: 0,
            }, newUser.id);
            return this.createToken({
                ...newUser,
                accountName: userAccount.accountName,
                amount: userAccount.amount,
                currency: userAccount.currency || 'EUR',
            }, ipAddress, userAgent);
        }
        return this.createToken(user, ipAddress, userAgent);
    }
    async createToken(user, ipAddress, userAgent) {
        const payload = { email: user.email, sub: user.id, type: 'access' };
        const refresh_token = await this.createRefreshToken(user, ipAddress, userAgent);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountName: user.accountName,
                amount: user.amount,
                firstLogin: user.firstLogin,
                avatar: user.avatar,
                locale: user.locale,
                verifiedEmail: user.verifiedEmail,
                currency: user.currency || 'EUR',
            },
            sessionId: refresh_token.sessionId,
            accessToken: await this.jwtService.signAsync(payload, { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' }),
            accessTokenExpiresAt: new Date(Date.now() + (0, ms_1.default)(process.env.JWT_EXPIRES_IN ?? '15m')),
            refreshToken: refresh_token.refreshToken,
            refreshTokenExpiresAt: refresh_token.expiresAt,
        };
    }
    async createRefreshToken(user, ipAddress, userAgent) {
        const sessionId = (0, uuid_1.v4)();
        const payload = { sub: user.id, type: 'refresh', sid: sessionId };
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' });
        const expiresAt = new Date(Date.now() + (0, ms_1.default)(process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'));
        await this.db.insert(schema.sessions).values({
            id: sessionId,
            userId: user.id,
            tokenHash: await bcrypt.hash(refreshToken, 10),
            ipAddress: ipAddress ?? 'unknown',
            userAgent: userAgent ?? 'unknown',
            expiresAt
        });
        return {
            refreshToken,
            expiresAt,
            sessionId: sessionId
        };
    }
    async refreshAccessToken(refreshToken, ipAddress, userAgent) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: constants_1.jwtConstants.secret
            });
            if (payload.type !== 'refresh' || !payload.sub || !payload.sid) {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const user = await this.usersService.findOne(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid user');
            }
            const tokens = await this.db
                .select()
                .from(schema.sessions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.sessions.userId, payload.sub), (0, drizzle_orm_1.eq)(schema.sessions.isRevoked, false), (0, drizzle_orm_1.eq)(schema.sessions.id, payload.sid)));
            const valid = await Promise.all(tokens.map(async (token) => ({
                match: await bcrypt.compare(refreshToken, token.tokenHash),
                token,
            })));
            const found = valid.find(t => t.match);
            if (!found) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newAccessToken = this.jwtService.sign({ sub: payload.sub, type: 'access' }, { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' });
            const expiresAt = new Date(Date.now() + (0, ms_1.default)(process.env.JWT_EXPIRES_IN ?? '15m'));
            return {
                accessToken: newAccessToken,
                accessTokenExpiresAt: expiresAt,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(sessionId) {
        const result = await this.db
            .update(schema.sessions)
            .set({ isRevoked: true })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.sessions.id, sessionId), (0, drizzle_orm_1.eq)(schema.sessions.isRevoked, false)));
        if (result.rowCount === 0) {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        return {
            message: 'Logged out'
        };
    }
    async removeRevokedSessions() {
        await this.db
            .delete(schema.sessions)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.sessions.isRevoked, true), (0, drizzle_orm_1.lt)(schema.sessions.expiresAt, new Date())));
        return {
            message: 'Revoked sessions removed'
        };
    }
    async handleCron() {
        await this.removeRevokedSessions();
        this.logger.debug('Cron job executed');
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent.',
            };
        }
        const payload = { sub: user.id, type: 'forgot-password' };
        const token = await this.jwtService.signAsync(payload, { expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN ?? '15m' });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.mailService.sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            template: 'reset-password',
            context: {
                firstName: user.firstName,
                lastName: user.lastName,
                resetLink,
            },
        });
        return {
            message: 'If the email exists, a password reset link has been sent.',
        };
    }
    async resetPassword(resetPasswordDto) {
        try {
            const payload = await this.jwtService.verifyAsync(resetPasswordDto.token, {
                secret: constants_1.jwtConstants.secret,
            });
            if (payload.type !== 'forgot-password' || !payload.sub) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const user = await this.usersService.findOne(payload.sub);
            const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
            try {
                await this.db.update(schema.users)
                    .set({ password: hashedPassword })
                    .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Failed to reset password');
            }
            return {
                message: 'Password has been reset successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token !');
        }
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "handleCron", null);
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __param(1, (0, common_1.Inject)(jwt_1.JwtService)),
    __param(2, (0, common_1.Inject)(user_account_service_1.UserAccountService)),
    __param(3, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(4, (0, common_1.Inject)(mail_service_1.MailService)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        user_account_service_1.UserAccountService,
        node_postgres_1.NodePgDatabase,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map