import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
export const LoginDtoSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
})

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export class LoginInput {
  @ApiProperty({ type: String, format: 'email', example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ type: String, format: 'password', example: 'SecurePass123!' })
  password!: string;
}