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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_provider_1 = require("../db/drizzle/drizzle.provider");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let CategoriesService = class CategoriesService {
    constructor(db) {
        this.db = db;
    }
    async create(createCategoryDto, userId) {
        const category = await this.db.insert(schema.categories).values({
            ...createCategoryDto,
            userId,
        }).returning();
        return category[0];
    }
    async findAll(userId) {
        return this.db.select().from(schema.categories).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.categories.userId, userId), (0, drizzle_orm_1.isNull)(schema.categories.userId)));
    }
    async findOne(id, userId) {
        const result = await this.db.select().from(schema.categories).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.categories.id, id), (0, drizzle_orm_1.eq)(schema.categories.isDeleted, false)));
        if (result.length === 0) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (result[0].userId !== null && result[0].userId !== userId) {
            throw new common_1.NotFoundException('This category does not belong to your account');
        }
        return result[0];
    }
    async update(id, updateCategoryDto, userId) {
        const category = await this.findOne(id, userId);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.userId !== userId || category.userId === null) {
            throw new common_1.BadRequestException('You can only update your own categories');
        }
        const result = await this.db.update(schema.categories).set({
            ...updateCategoryDto,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema.categories.id, id)).returning();
        return result[0];
    }
    async remove(id, userId, deleteCategoryDto) {
        const category = await this.findOne(id, userId);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.userId !== userId || category.userId === null) {
            throw new common_1.BadRequestException('You can only delete your own categories');
        }
        if (category.isDefault || category.isDeleted) {
            throw new common_1.BadRequestException('You cannot delete a default or already deleted category');
        }
        return await this.db.transaction(async (tx) => {
            if (deleteCategoryDto.replaceOldTransactionsCategoryId) {
                if (!deleteCategoryDto.newCategoryId) {
                    const defaultCategory = await tx.select().from(schema.categories).where((0, drizzle_orm_1.eq)(schema.categories.isDefault, true)).limit(1);
                    if (defaultCategory.length === 0) {
                        throw new common_1.BadRequestException('Default category not found');
                    }
                    await tx.update(schema.transactions).set({
                        categoryId: defaultCategory[0].id,
                    }).where((0, drizzle_orm_1.eq)(schema.transactions.categoryId, id));
                    await tx.delete(schema.categories).where((0, drizzle_orm_1.eq)(schema.categories.id, id));
                }
                else {
                    await this.findOne(deleteCategoryDto.newCategoryId, userId);
                    await tx.update(schema.transactions).set({
                        categoryId: deleteCategoryDto.newCategoryId,
                    }).where((0, drizzle_orm_1.eq)(schema.transactions.categoryId, id));
                    await tx.delete(schema.categories).where((0, drizzle_orm_1.eq)(schema.categories.id, id));
                }
            }
            else {
                const transactionCount = await tx.select({ count: (0, drizzle_orm_1.count)() }).from(schema.transactions).where((0, drizzle_orm_1.eq)(schema.transactions.categoryId, id)).then((result) => result[0]);
                if (transactionCount.count > 0) {
                    await tx.update(schema.categories).set({
                        isDeleted: true,
                        updatedAt: new Date(),
                    }).where((0, drizzle_orm_1.eq)(schema.categories.id, id));
                }
                else {
                    await tx.delete(schema.categories).where((0, drizzle_orm_1.eq)(schema.categories.id, id));
                }
            }
            return;
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DrizzleAsyncProvider)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map