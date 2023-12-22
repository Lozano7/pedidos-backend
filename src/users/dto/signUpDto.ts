import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly email;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password;

  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly lastName;

  @IsNotEmpty()
  @IsString()
  readonly identification;

  @IsString()
  readonly restaurantId;

  @ArrayNotEmpty({ message: 'Los roles no pueden estar vacíos' })
  @IsArray({ message: 'Los roles deben ser un array' })
  @IsString({ each: true, message: 'Cada rol debe ser una cadena de texto' })
  readonly roles;
}
