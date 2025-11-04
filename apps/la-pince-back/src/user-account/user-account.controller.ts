import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseUUIDPipe, } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto, CreateUserAccountSchema } from './dto/create-user-account.dto';
import { UpdateUserAccountDto, UpdateUserAccountSchema } from './dto/update-user-account.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User, UserEntity } from '../decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserAccountInput } from './dto/create-user-account.dto';
import { UpdateUserAccountInput } from './dto/update-user-account.dto';

@ApiTags('UserAccount')
@ApiBearerAuth()
@Controller('account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  /**
   * Create a new user account
   * @param createUserAccountDto
   * @returns
   */
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiBody({ type: CreateUserAccountInput })
  @ApiCreatedResponse({ description: 'Compte créé avec succès' })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateUserAccountSchema)) createUserAccountDto: CreateUserAccountDto,
    @User() user: UserEntity,
  ) {
    return this.userAccountService.create(createUserAccountDto, user.id);
  }

  /**
   * Get one user account by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer un compte par ID' })
  @ApiParam({ name: 'id', description: 'UUID du compte', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Compte trouvé' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userAccountService.findOne(id);
  }

  /**
   * Get a user account by user id
   * @param id
   * @param updateUserAccountDto
   * @returns
   */
  @ApiOperation({ summary: 'Récupérer un compte par ID utilisateur' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Compte trouvé' })
  @Get('user/:id')
  findOneByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.userAccountService.findOneByUserId(id);
  }

  /**
   * Update a user account by his user id
   * @param id 
   * @param updateUserAccountDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Mettre à jour un compte par ID utilisateur' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur', schema: { format: 'uuid' } })
  @ApiBody({ type: UpdateUserAccountInput })
  @ApiOkResponse({ description: 'Compte mis à jour avec succès' })
  @Patch('user/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body(new ZodValidationPipe(UpdateUserAccountSchema)) updateUserAccountDto: UpdateUserAccountDto) {
    return this.userAccountService.update(id, updateUserAccountDto);
  }

  /**
   * Delete a user account by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Supprimer un compte' })
  @ApiParam({ name: 'id', description: 'UUID du compte', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Compte supprimé avec succès' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userAccountService.remove(id);
  }
}
