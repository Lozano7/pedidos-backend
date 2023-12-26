import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMenu } from '../interfaces/menu.interface';

@Schema()
export class Menu {
  @Prop({ required: true, unique: true })
  date: string;

  @Prop({ required: true })
  menus: IMenu[];
}

export type MenuDocument = Menu & Document;

export const MenuSchema = SchemaFactory.createForClass(Menu);
