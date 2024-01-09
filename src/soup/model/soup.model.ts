import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Soup {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  restaurantId: string;
}

export type SoupDocument = Soup & Document;

export const SoupSchema = SchemaFactory.createForClass(Soup);
