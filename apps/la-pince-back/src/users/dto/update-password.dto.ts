import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string()
  .trim()
  .min(12)
  .refine((password) => /[a-z]/g.test(password ?? ""), 'Password must contain at least one lowercase letter')
  .refine((password) => /[A-Z]/g.test(password ?? ""), 'Password must contain at least one uppercase letter')
  .refine((password) => /[0-9]/g.test(password ?? ""), 'Password must contain at least one digit')
  .refine((password) => /[^a-zA-Z0-9]/g.test(password ?? ""), 'Password must contain at least one special character'),
  confirmNewPassword: z.string().min(12, 'Confirm new password must be at least 12 characters long'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'New password and confirm new password must match',
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;


export class UpdatePasswordInput {
  @ApiProperty({ type: String, format: 'password', description: 'Mot de passe actuel' })
  currentPassword!: string;

  @ApiProperty({ type: String, format: 'password', minLength: 12, description: 'Doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial', example: 'NewSecurePass123!' })
  newPassword!: string;

  @ApiProperty({ type: String, format: 'password', minLength: 12, description: 'Doit correspondre au nouveau mot de passe', example: 'NewSecurePass123!' })
  confirmNewPassword!: string;
}