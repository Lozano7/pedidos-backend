import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'correo@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly email;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Contraseña123@',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  readonly name;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Perez',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName;

  @ApiProperty({
    description: 'Identificación del usuario',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  readonly identification;

  @ApiProperty({
    description: 'Identificación del restaurante',
    example: '123456789',
  })
  @IsString()
  readonly restaurantId;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['ADMIN', 'RESTAURANT'],
  })
  @ArrayNotEmpty({ message: 'Los roles no pueden estar vacíos' })
  @IsArray({ message: 'Los roles deben ser un array' })
  @IsString({ each: true, message: 'Cada rol debe ser una cadena de texto' })
  readonly roles;
}
