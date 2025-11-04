import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserEntity } from '../decorator/user.decorator';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        color: string | null;
        icon: string | null;
        isDefault: boolean;
        isDeleted: boolean;
    }>;
    findAll(user: UserEntity): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        color: string | null;
        icon: string | null;
        isDefault: boolean;
        isDeleted: boolean;
    }[]>;
    findOne(id: string, user: UserEntity): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        color: string | null;
        icon: string | null;
        isDefault: boolean;
        isDeleted: boolean;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, user: UserEntity): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        color: string | null;
        icon: string | null;
        isDefault: boolean;
        isDeleted: boolean;
    }>;
    remove(id: string, user: UserEntity, replaceOldTransactionsCategoryId?: boolean, newCategoryId?: string | undefined): Promise<void>;
}
