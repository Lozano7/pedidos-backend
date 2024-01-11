import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Second {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  restaurantId: string;
}

export type SecondDocument = Second & Document;

export const SecondSchema = SchemaFactory.createForClass(Second);
