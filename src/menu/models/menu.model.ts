import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMenu } from '../interfaces/menu.interface';

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true })
  date: string;

  @Prop({ required: true })
  menus: IMenu[];

  @Prop({ required: true })
  restaurantId: string;

  @Prop({ required: true })
  restaurantName: string;

  @Prop({ required: true })
  restaurantAddress: string;

  @Prop({ required: true })
  restaurantStartOrderTime: string;

  @Prop({ required: true })
  restaurantEndOrderTime: string;

  @Prop({ required: true })
  restaurantDeliveryTime: string;
}

export type MenuDocument = Menu & Document;

export const MenuSchema = SchemaFactory.createForClass(Menu);
