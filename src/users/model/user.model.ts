import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/constants/roles';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  identification: string;

  @Prop()
  restaurantId: string;

  @Prop({ required: true })
  roles: ROLES[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
