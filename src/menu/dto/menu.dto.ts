import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MenuDto {
  @IsNotEmpty()
  @IsString()
  readonly date;

  @ArrayNotEmpty({ message: 'Al menos debe registrar un menu' })
  @IsArray({ message: 'Los menus debe ser un array' })
  readonly menus;

  @IsNotEmpty()
  @IsString()
  readonly restaurantName;

  @IsNotEmpty()
  @IsString()
  readonly restaurantAddress;

  @IsNotEmpty()
  @IsString()
  readonly restaurantStartOrderTime;

  @IsNotEmpty()
  @IsString()
  readonly restaurantEndOrderTime;

  @IsNotEmpty()
  @IsString()
  readonly restaurantDeliveryTime;

  @IsNotEmpty()
  @IsString()
  readonly restaurantId;
}
