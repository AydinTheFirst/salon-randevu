import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  password: string;

  @IsString()
  username: string;
}
