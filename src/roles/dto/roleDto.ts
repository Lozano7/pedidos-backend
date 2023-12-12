import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly keyword;

  @IsString()
  readonly description;
}
