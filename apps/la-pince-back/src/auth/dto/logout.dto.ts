import { z } from "zod";
import { ApiProperty } from '@nestjs/swagger';
export const LogoutDtoSchema = z.object({
  sessionId: z.string(),
}).strict();

export type LogoutDto = z.infer<typeof LogoutDtoSchema>;

export class LogoutInput {
  @ApiProperty({ type: String, format: 'uuid', description: 'ID de la session à révoquer', example: '123e4567-e89b-12d3-a456-426614174000' })
  sessionId!: string;
}