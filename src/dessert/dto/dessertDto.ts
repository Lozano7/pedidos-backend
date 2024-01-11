import { IsNotEmpty, IsString } from 'class-validator';

export class DessertDto {
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
