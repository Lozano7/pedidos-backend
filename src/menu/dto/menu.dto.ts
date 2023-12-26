import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MenuDto {
  @IsNotEmpty()
  @IsString()
  readonly date;

  @ArrayNotEmpty({ message: 'Al menos debe registrar un menu' })
  @IsArray({ message: 'Los menus debe ser un array' })
  readonly menus;
}
