import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/constants/roles';

@Schema({ timestamps: true })
export class Pedido {
  @Prop({ required: true })
  restaurantId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  roles: ROLES[];

  @Prop({ required: true })
  nameClient: string;

  @Prop({ required: true })
  nameRestaurant: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  typeMenu: 'N' | 'D';

  @Prop({ required: true })
  soup: string;

  @Prop({ required: true })
  second: string;

  @Prop({ required: true })
  drink: string;

  @Prop({ required: true })
  dessert: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: string;
}

export type PedidoDocument = Pedido & Document;

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
