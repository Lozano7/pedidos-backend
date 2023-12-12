import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  keyword: string;

  @Prop({ required: true })
  description: string;
}

export type RoleDocument = Role & Document;

export const RoleSchema = SchemaFactory.createForClass(Role);
