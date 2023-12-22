import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  readonly ruc;

  @IsNotEmpty()
  @IsString()
  readonly adminName;

  @IsNotEmpty()
  @IsString()
  readonly address;

  @IsNotEmpty()
  @IsString()
  readonly status;

  @IsString()
  readonly phone;

  @IsNotEmpty()
  @IsString()
  readonly startOrderTime;

  @IsNotEmpty()
  @IsString()
  readonly endOrderTime;

  @IsNotEmpty()
  @IsString()
  readonly deliveryTime;
}
