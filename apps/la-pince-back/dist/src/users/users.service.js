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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = __importStar(require("bcrypt"));
const user_account_service_1 = require("../user-account/user-account.service");
let UsersService = class UsersService {
    constructor(db, userAccountService) {
        this.db = db;
        this.userAccountService = userAccountService;
    }
    async create(createUserDto) {
        const emailResponse = await this.findByEmail(createUserDto.email);
        if (emailResponse !== null && emailResponse !== undefined) {
            throw new common_1.BadRequestException('This email is already set !');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = await this.db.insert(schema.users).values({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: hashedPassword,
            accountType: createUserDto.accountType,
            locale: createUserDto.locale,
            avatar: createUserDto.avatar,
            createdAt: new Date()
        }).returning();
        return newUser[0];
    }
    async findAll() {
        return this.db.select().from(schema.users).orderBy((0, drizzle_orm_1.asc)(schema.users.lastName));
    }
    async findOne(id) {
        const result = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .innerJoin(schema.userAccounts, (0, drizzle_orm_1.eq)(schema.userAccounts.userId, schema.users.id));
        if (result.length === 0) {
            throw new common_1.NotFoundException(`A user with this id (${id})`);
        }
        return {
            ...result[0].users,
            accountId: result[0].user_accounts.id,
            accountName: result[0].user_accounts.accountName,
            amount: result[0].user_accounts.amount,
        };
    }
    async findByEmail(email) {
        const result = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, email));
        if (result.length === 0) {
            return null;
        }
        const userAccount = await this.userAccountService.findOneByUserId(result[0].id);
        return {
            ...result[0],
            accountId: userAccount?.id ?? null,
            accountName: userAccount?.accountName ?? null,
            amount: userAccount?.amount ?? null,
            currency: userAccount?.currency ?? null,
        };
    }
    async update(id, updateUserDto) {
        if (updateUserDto.email) {
            const emailResponse = await this.findByEmail(updateUserDto.email);
            if (emailResponse !== null && emailResponse !== undefined) {
                if (emailResponse.id !== id) {
                    throw new common_1.BadRequestException('This email is already set !');
                }
            }
        }
        const result = await this.db.update(schema.users).set({
            ...updateUserDto,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .returning();
        if (result.length === 0) {
            throw new common_1.BadRequestException('User not found');
        }
        return result[0];
    }
    async firstLogin(firstLoginDto, userId) {
        return await this.db.transaction(async (tx) => {
            await tx.update(schema.userAccounts).set({
                accountName: firstLoginDto.accountName,
                amount: firstLoginDto.totalAmount,
                currency: firstLoginDto.currency,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema.userAccounts.userId, userId));
            const user = await tx.update(schema.users).set({
                locale: firstLoginDto.locale,
                firstLogin: false,
                updatedAt: new Date()
            }).where((0, drizzle_orm_1.eq)(schema.users.id, userId))
                .returning();
            if (user.length === 0) {
                throw new common_1.BadRequestException('User not found');
            }
            return user[0];
        });
    }
    async updatePassword(id, updatePasswordDto) {
        const user = await this.findOne(id);
        const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        const result = await this.db.update(schema.users).set({
            password: hashedNewPassword,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .returning();
        if (result.length === 0) {
            throw new common_1.BadRequestException('User not found');
        }
        return {
            message: 'Password updated successfully',
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __param(1, (0, common_1.Inject)(user_account_service_1.UserAccountService)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        user_account_service_1.UserAccountService])
], UsersService);
//# sourceMappingURL=users.service.js.map