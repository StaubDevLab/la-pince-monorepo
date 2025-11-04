import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';
export declare class CategoriesService {
    private readonly db;
    constructor(db: NodePgDatabase<typeof schema>);
    create(createCategoryDto: CreateCategoryDto, userId: string): Promise<schema.Category>;
    findAll(userId: string): Promise<schema.Category[]>;
    findOne(id: string, userId: string): Promise<schema.Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string): Promise<schema.Category>;
    remove(id: string, userId: string, deleteCategoryDto: DeleteCategoryDto): Promise<void>;
}
