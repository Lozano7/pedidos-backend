import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Dessert {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;
}

export type DessertDocument = Dessert & Document;

export const DessertSchema = SchemaFactory.createForClass(Dessert);
