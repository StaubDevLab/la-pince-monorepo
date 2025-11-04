import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { FirstLoginDto, FirstLoginSchema } from './dto/first-login.dto';
import { UpdatePasswordDto, UpdatePasswordSchema } from './dto/update-password.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User, UserEntity } from '../decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserInput } from './dto/update-user.dto';
import { FirstLoginInput } from './dto/first-login.dto';
import { UpdatePasswordInput } from './dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Première connexion - Configuration initiale' })
  @ApiBody({ type: FirstLoginInput })
  @ApiOkResponse({ description: 'Configuration initiale effectuée avec succès' })
  @Post('first-login')
  firstLogin(
    @Body(new ZodValidationPipe(FirstLoginSchema)) firstLoginDto: FirstLoginDto,
    @User() user: UserEntity,
  ) {
    return this.usersService.firstLogin(firstLoginDto, user.id);
  }

  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiOkResponse({ description: 'Profil utilisateur' })
  @Get()
  findOne(@User() user: UserEntity,) {
    return this.usersService.findOne(user.id);
  }

  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiBody({ type: UpdateUserInput })
  @ApiOkResponse({ description: 'Profil mis à jour avec succès' })
  @Patch()
  update(
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Modifier le mot de passe' })
  @ApiBody({ type: UpdatePasswordInput })
  @ApiOkResponse({ description: 'Mot de passe modifié avec succès' })
  @Patch('password')
  updatePassword(
    @Body(new ZodValidationPipe(UpdatePasswordSchema)) updateUserDto: UpdatePasswordDto,
    @User() user: UserEntity,
  ) {
    return this.usersService.updatePassword(user.id, updateUserDto);
  }
}
