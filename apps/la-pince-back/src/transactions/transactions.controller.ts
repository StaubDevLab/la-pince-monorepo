import { Controller, Get, Post, Body, Patch, Param, Delete, ParseBoolPipe, ParseUUIDPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, CreateTransactionInput, CreateTransactionSchema } from './dto/create-transaction.dto';
import { UpdateTransactionDto, UpdateTransactionInput, UpdateTransactionSchema } from './dto/update-transaction.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User, UserEntity } from '../decorator/user.decorator';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBody, ApiOkResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Create a new transaction
   * @param createTransactionDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Créer une transaction' })
  @ApiBody({ type: CreateTransactionInput })
  @ApiCreatedResponse({ description: 'Transaction créée' })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateTransactionSchema)) createTransactionDto: CreateTransactionDto,
    @User() user: UserEntity,
  ) {
    return this.transactionsService.create(createTransactionDto, user.id);
  }

  /**
   * Get all transactions for a user
   * @returns 
   */
  @ApiOperation({ summary: 'Lister les transactions (paginées)' })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'integer', minimum: 1 }, example: 10 })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 0 }, example: 0 })
  @ApiOkResponse({ description: 'Liste paginée des transactions' })
  @Get()
  findAll(
    @User() user: UserEntity,
    @Query('limit') limit: number = 10,
    @Query('page') offset: number = 0,
  ) {
    return this.transactionsService.findAll(user.id, +limit, +offset);
  }

  /**
   * Get a transaction by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer une transaction par ID' })
  @ApiParam({ name: 'id', description: 'UUID de la transaction', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Transaction trouvée' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity,) {
    return this.transactionsService.findOne(id, user.id);
  }

  /**
   * Update a transaction
   * @param id 
   * @param updateTransactionDto 
   * @param req 
   * @returns 
   */
  @ApiOperation({ summary: 'Mettre à jour une transaction' })
  @ApiParam({ name: 'id', description: 'UUID de la transaction', schema: { format: 'uuid' } })
  @ApiQuery({ name: 'updateNextChilds', required: false, schema: { type: 'boolean' }, example: false })
  @ApiBody({ type: UpdateTransactionInput })
  @ApiOkResponse({ description: 'Transaction mise à jour' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(new ZodValidationPipe(UpdateTransactionSchema)) updateTransactionDto: UpdateTransactionDto,
    @User() user: UserEntity,
    @Query('updateNextChilds', new DefaultValuePipe(false), ParseBoolPipe) updateNextChilds: boolean = false,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, user.id, updateNextChilds);
  }

  /**
   * Delete a transaction
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Supprimer une transaction' })
  @ApiParam({ name: 'id', description: 'UUID de la transaction', schema: { format: 'uuid' } })
  @ApiQuery({ name: 'removeChildren', required: false, schema: { type: 'boolean' }, example: false })
  @ApiOkResponse({ description: 'Transaction supprimée' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string, 
    @User() user: UserEntity,
    @Query('removeChildren') removeChildren: boolean = false,
  ) {
    return this.transactionsService.remove(id, user.id, removeChildren);
  }

  /**
   * Stop a recurring transaction
   * @param id
   */
  @ApiOperation({ summary: 'Arrêter une transaction récurrente' })
  @ApiParam({ name: 'id', description: 'UUID de la transaction (parent ou enfant)', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Transaction récurrente arrêtée' })
  @Delete('recurring/stop/:id')
  stopRecurringTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserEntity,
  ) {
    return this.transactionsService.stopRecurringTransaction(id, user.id);
  }
}
