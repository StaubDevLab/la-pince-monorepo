import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateNotificationSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

export type UpdateNotificationDto = z.infer<typeof UpdateNotificationSchema>;

export const UpdateMultipleNotificationsSchema = z.object({
  ids: z.array(z.string().uuid()),
  isRead: z.boolean().optional().default(true),
});

export type UpdateMultipleNotificationsDto = z.infer<typeof UpdateMultipleNotificationsSchema>;

// DTO de description pour Swagger (utilisé par @ApiBody)
export class UpdateNotificationInput {
  @ApiPropertyOptional({ type: Boolean, default: true, example: true })
  isRead?: boolean;
}

export class UpdateMultipleNotificationsInput {
  @ApiProperty({ type: [String], description: 'Liste des UUIDs des notifications', example: ['123e4567-e89b-12d3-a456-426614174000'] })
  ids!: string[];

  @ApiPropertyOptional({ type: Boolean, default: true, example: true })
  isRead?: boolean;
}