import { IsEmail, IsString, Length, Matches, IsNumberString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'newPassword between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, but cannot contain whitespace.',
  })
  readonly newPassword: string;

  @IsNumberString()
  @Length(6, 6, { message: 'confirmationCode must be equal to 6 characters' })
  readonly confirmationCode: string;
}
