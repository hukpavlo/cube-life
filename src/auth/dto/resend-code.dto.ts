import { IsEmail } from 'class-validator';

export class ResendCodeDto {
  @IsEmail()
  readonly email: string;
}
