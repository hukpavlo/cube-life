import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, IsNumberString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'newPassword between 8 and 20 characters; must contain at least one lowercase letter, one uppercase letter, one numeric digit, but cannot contain whitespace.',
  })
  @ApiProperty()
  readonly newPassword: string;

  @IsNumberString()
  @Length(6, 6, { message: 'confirmationCode must be equal to 6 characters' })
  @ApiProperty()
  readonly confirmationCode: string;
}
