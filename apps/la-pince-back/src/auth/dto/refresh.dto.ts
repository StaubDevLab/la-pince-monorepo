import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
export const RefreshDtoSchema = z.object({
  refreshToken: z.string(),
}).strict();

export type RefreshDto = z.infer<typeof RefreshDtoSchema>;

export class RefreshInput {
  @ApiProperty({ type: String, description: 'Refresh token JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken!: string;
}