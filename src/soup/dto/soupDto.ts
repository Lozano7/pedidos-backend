import { IsNotEmpty, IsString } from 'class-validator';

export class SoupDto {
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
