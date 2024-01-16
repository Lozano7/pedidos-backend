import { Injectable } from '@nestjs/common';
import { ROLES } from 'src/constants/roles';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { UserService } from '../users/users.service';

@Injectable()
export class ReportService {
  constructor(
    private pedidosService: PedidosService,
    private userService: UserService,
  ) {}

  async getDashboardData() {
    //date debe tener el formato dd/mm/yyyy
    const pedidos = await this.pedidosService.getAllByDateActual();
    const users = await this.getUsers();
    // aqui comienzan las validaciones para devolver: el numero total de pedidos, el valor total a pagar por los pedidos, el restaurante al que mas pedidos le han hecho, la cantidad de pedidos, el numero de personas que han tomado un menu de dieta, y cuantos han pedio un menu normal.
    let totalPedidos = pedidos.length;
    let totalValor = await pedidos.reduce((acc, pedido) => {
      return acc + Number(pedido.price);
    }, 0);
    //aqui va los restaurantes que tenga el mismo restaurantId siempre y cuando se ha repetido mas de una vez devolvera el nombre y el total de los price sumados si no devolvera un objeto vacio
    let restaurant = await pedidos.reduce((acc, pedido) => {
      const index = acc.findIndex(
        (item) => item.restaurantId === pedido.restaurantId,
      );
      if (index === -1) {
        acc.push({
          restaurantId: pedido.restaurantId,
          name: pedido.nameRestaurant,
          price: Number(pedido.price),
        });
      } else {
        acc[index].price += Number(pedido.price);
      }
      return acc;
    }, []);

    let cantidadDieta = await pedidos.filter(
      (pedido) => pedido.typeMenu === 'D',
    ).length;
    let cantidadNormal = await pedidos.filter(
      (pedido) => pedido.typeMenu === 'N',
    ).length;
    let cantidadUsuarios = users.length;

    return {
      totalPedidos,
      totalValor,
      restaurant,
      cantidadDieta,
      cantidadNormal,
      cantidadUsuarios,
    };
  }

  async getUsers() {
    const users = await this.userService.getAll('', 1, 10, true);
    console.log('users', users);
    if (Array.isArray(users)) {
      return users.filter(
        (user) =>
          user.roles.includes(ROLES.COLLABORATOR) ||
          user.roles.includes(ROLES.INTERN),
      );
    }
    return [];
  }
}
