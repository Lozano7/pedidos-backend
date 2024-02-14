import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PedidoDto {
  @IsNotEmpty()
  @IsString()
  readonly restaurantId;

  @IsNotEmpty()
  @IsString()
  readonly nameClient;

  @IsNotEmpty()
  @IsString()
  readonly nameRestaurant;

  @IsNotEmpty()
  @IsString()
  readonly clientId;

  @IsNotEmpty()
  @IsString()
  readonly date;

  @IsNotEmpty()
  @IsString()
  readonly typeMenu;

  @IsNotEmpty()
  @IsString()
  readonly soup;

  @IsNotEmpty()
  @IsString()
  readonly second;

  @IsNotEmpty()
  @IsString()
  readonly drink;

  @IsNotEmpty()
  @IsString()
  readonly dessert;

  @IsNotEmpty()
  @IsString()
  readonly price;

  @IsNotEmpty()
  @IsString()
  readonly status;

  @ArrayNotEmpty({ message: 'Los roles no pueden estar vacíos' })
  @IsArray({ message: 'Los roles deben ser un array' })
  @IsString({ each: true, message: 'Cada rol debe ser una cadena de texto' })
  readonly roles;
}
