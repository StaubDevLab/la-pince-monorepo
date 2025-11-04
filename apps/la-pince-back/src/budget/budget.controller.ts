import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseUUIDPipe } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto, CreateBudgetInput, CreateBudgetSchema } from './dto/create-budget.dto';
import { UpdateBudgetDto, UpdateBudgetInput, UpdateBudgetSchema } from './dto/update-budget.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User, UserEntity } from 'src/decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';


@ApiTags('Budgets')
@ApiBearerAuth()
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  /**
   * Create a new budget
   * @param createBudgetDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Créer un budget' })
  @ApiBody({ type: CreateBudgetInput })
  @ApiCreatedResponse({ description: 'Budget créé avec succès' })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateBudgetSchema)) createBudgetDto: CreateBudgetDto,
    @User() user: UserEntity
  ) {
    return this.budgetService.create(createBudgetDto, user.id);
  }

  /**
   * Get all budget by user id
   * @returns 
   */
  @ApiOperation({ summary: 'Lister tous les budgets de l\'utilisateur' })
  @ApiOkResponse({ description: 'Liste des budgets' })
  @Get()
  findAll(@User() user: UserEntity) {
    return this.budgetService.findAllByUserId(user.id);
  }

  /**
   * Get a budget by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer un budget par ID' })
  @ApiParam({ name: 'id', description: 'UUID du budget', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Budget trouvé' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity) {
    return this.budgetService.findOne(id, user.id);
  }

  /**
   * Update a budget
   * @param id 
   * @param updateBudgetDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Mettre à jour un budget' })
  @ApiParam({ name: 'id', description: 'UUID du budget', schema: { format: 'uuid' } })
  @ApiBody({ type: UpdateBudgetInput })
  @ApiOkResponse({ description: 'Budget mis à jour avec succès' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(new ZodValidationPipe(UpdateBudgetSchema)) updateBudgetDto: UpdateBudgetDto,
    @User() user: UserEntity
  ) {
    return this.budgetService.update(id, updateBudgetDto, user.id);
  }

  /**
   * Delete a budget
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Supprimer un budget' })
  @ApiParam({ name: 'id', description: 'UUID du budget', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Budget supprimé avec succès' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity) {
    return this.budgetService.remove(id, user.id);
  }
}
