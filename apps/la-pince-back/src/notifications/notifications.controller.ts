import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto, UpdateNotificationSchema, UpdateMultipleNotificationsDto, UpdateMultipleNotificationsSchema } from './dto/update-notification.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User, UserEntity } from '../decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { UpdateNotificationInput, UpdateMultipleNotificationsInput } from './dto/update-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Get all notifications for the current user
   * @param isRead
   * @param page
   * @param limit
   * @returns 
   */
  @ApiOperation({ summary: 'Lister les notifications de l\'utilisateur' })
  @ApiQuery({ name: 'isRead', required: false, schema: { type: 'boolean' }, example: false, description: 'Filtrer par statut de lecture' })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 0 }, example: 0 })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'integer', minimum: 1 }, example: 10 })
  @ApiOkResponse({ description: 'Liste paginée des notifications' })
  @Get()
  findAll(
    @User() user: UserEntity,
    @Query('isRead') isRead: boolean = false,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10
  ) {
    return this.notificationsService.findAll(user.id, isRead, +limit, +page);
  }

  /**
   * Get a notification by id
   * @param id 
   * @returns 
   */
  @ApiOperation({ summary: 'Récupérer une notification par ID' })
  @ApiParam({ name: 'id', description: 'UUID de la notification', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Notification trouvée' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity,) {
    return this.notificationsService.findOne(id, user.id);
  }

  /**
   * Update a notification
   * @param id 
   * @param updateNotificationDto 
   * @returns 
   */
  @ApiOperation({ summary: 'Mettre à jour une notification' })
  @ApiParam({ name: 'id', description: 'UUID de la notification', schema: { format: 'uuid' } })
  @ApiBody({ type: UpdateNotificationInput })
  @ApiOkResponse({ description: 'Notification mise à jour avec succès' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(new ZodValidationPipe(UpdateNotificationSchema)) updateNotificationDto: UpdateNotificationDto,
    @User() user: UserEntity,
  ) {
    return this.notificationsService.update(id, updateNotificationDto, user.id);
  }

  /**
   * Update multiple notifications
   * @param updateNotificationDto
   * @returns
   */
  @ApiOperation({ summary: 'Mettre à jour plusieurs notifications' })
  @ApiBody({ type: UpdateMultipleNotificationsInput })
  @ApiOkResponse({ description: 'Notifications mises à jour avec succès' })
  @Patch()
  updateMultiple(
    @Body(new ZodValidationPipe(UpdateMultipleNotificationsSchema)) updateNotificationDto: UpdateMultipleNotificationsDto,
    @User() user: UserEntity,
  ) {
    return this.notificationsService.updateMultiple(updateNotificationDto, user.id);
  }

  /**
   * Delete a notification
   * @param id
   * @returns
   */
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiParam({ name: 'id', description: 'UUID de la notification', schema: { format: 'uuid' } })
  @ApiOkResponse({ description: 'Notification supprimée avec succès' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity,) {
    return this.notificationsService.remove(id, user.id);
  }
}
