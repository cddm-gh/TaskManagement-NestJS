import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `password should meet this criteria:
      contain at least 1 upper case letter.
      contain at least 1 lower case letter.
      contain at least 1 number or speacial character.`,
  })
  password: string;
  /**
   * Passwords will contain at least 1 upper case letter
   * Passwords will contain at least 1 lower case letter
   * Passwords will contain at least 1 number or special character
   * There is no length validation (min, max) in this regex!
   */
}
