import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly newPassword: string;

  @IsString()
  @Length(6)
  readonly confirmationCode: string;
}
