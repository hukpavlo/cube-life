import { IsEmail, Length, IsNumberString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  readonly email: string;

  @IsNumberString()
  @Length(6, 6, { message: 'confirmationCode must be equal to 6 characters' })
  readonly confirmationCode: string;
}
