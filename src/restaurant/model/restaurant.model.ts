import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  ruc: string;

  @Prop({ required: true })
  adminName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  startOrderTime: string;

  @Prop({ required: true })
  endOrderTime: string;

  @Prop({ required: true })
  deliveryTime: string;
}

export type RestaurantDocument = Restaurant & Document;

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
