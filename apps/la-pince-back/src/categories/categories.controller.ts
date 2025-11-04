import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseUUIDPipe, Query, DefaultValuePipe, ParseBoolPipe} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, CreateCategoryInput, CreateCategorySchema } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryInput, UpdateCategorySchema } from './dto/update-category.dto';
import { DeleteCategoryDto, DeleteCategoryInput } from './dto/delete-category.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User, UserEntity } from '../decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiBody, ApiParam, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Create a new category
   * @param createCategoryDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiBody({ type: CreateCategoryInput })
  @ApiCreatedResponse({ description: 'Catégorie créée avec succès' })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateCategorySchema)) createCategoryDto: CreateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoriesService.create(createCategoryDto, user.id);
  }

  /**
   * Get all categories
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  @Get()
  findAll(@User() user: UserEntity,) {
    return this.categoriesService.findAll(user.id);
  }

  /**
   * Get a category by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer une catégorie par ID' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Catégorie trouvée' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity,) {
    return this.categoriesService.findOne(id, user.id);
  }

  /**
   * Update a category by id. The user must be the owner of the category.
   * @param id 
   * @param updateCategoryDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie', schema: { format: 'uuid' } })
  @ApiBody({ type: UpdateCategoryInput })
  @ApiOkResponse({ description: 'Catégorie mise à jour' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(new ZodValidationPipe(UpdateCategorySchema)) updateCategoryDto: UpdateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user.id);
  }

  /**
   * Delete a category by id. The user must be the owner of the category.
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie', schema: { format: 'uuid' } })
  @ApiBody({ type: DeleteCategoryInput })
  @ApiOkResponse({ description: 'Catégorie supprimée' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string, 
    @User() user: UserEntity,
    @Query('replaceOldTransactionsCategoryId', new DefaultValuePipe(false), ParseBoolPipe) replaceOldTransactionsCategoryId: boolean = false,
    @Query('newCategoryId', new DefaultValuePipe(undefined)) newCategoryId: string | undefined = undefined,
  ) {
    return this.categoriesService.remove(id, user.id, {
      replaceOldTransactionsCategoryId,
      newCategoryId,
    } as DeleteCategoryDto);
  }
}
