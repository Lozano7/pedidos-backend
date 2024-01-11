import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Drink {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  restaurantId: string;
}

export type DrinkDocument = Drink & Document;

export const DrinkSchema = SchemaFactory.createForClass(Drink);
