import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  query: string;
}

export class ResetPasswordDto {
  @IsString()
  password: string;

  @IsString()
  token: string;
}
