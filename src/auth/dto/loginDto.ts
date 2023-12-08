import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly email;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password;
}
