import { IsNotEmpty, IsString } from 'class-validator';

export class PedidoDto {
  @IsNotEmpty()
  @IsString()
  readonly restaurantId;

  @IsNotEmpty()
  @IsString()
  readonly nameClient;

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
}
