import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, but cannot contain whitespace.',
  })
  readonly password: string;
}
