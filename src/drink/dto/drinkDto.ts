import { IsNotEmpty, IsString } from 'class-validator';

export class DrinkDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly type;

  @IsNotEmpty()
  @IsString()
  readonly restaurantId;
}
