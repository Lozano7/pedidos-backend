export interface Pedido {
  _id: string;
  nameClient: string;
  nameRestaurant: string;
  restaurantId: string;
  clientId: string;
  date: string;
  typeMenu: string;
  soup: string;
  second: string;
  drink: string;
  dessert: string;
  price: number;
  __v: number;
}
