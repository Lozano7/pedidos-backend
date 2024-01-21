import { Injectable } from '@nestjs/common';
import { ROLES } from 'src/constants/roles';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { formatDate } from 'src/utils';
import { UserService } from '../users/users.service';

@Injectable()
export class ReportService {
  constructor(
    private pedidosService: PedidosService,
    private userService: UserService,
  ) {}

  async getDashboardData() {
    //date debe tener el formato dd/mm/yyyy
    const pedidos = await this.pedidosService.getAllByDateActual('01/18/2024');
    const users = await this.getUsers();
    const latestUsers = await this.getLatestUsers();
    // aqui comienzan las validaciones para devolver: el numero total de pedidos, el valor total a pagar por los pedidos, el restaurante al que mas pedidos le han hecho, la cantidad de pedidos, el numero de personas que han tomado un menu de dieta, y cuantos han pedio un menu normal.
    let totalPedidos = pedidos.length;
    let totalValor = await pedidos.reduce((acc, pedido) => {
      return acc + Number(pedido.price);
    }, 0);
    //aqui va los restaurantes que tenga el mismo restaurantId siempre y cuando se ha repetido mas de una vez devolvera el nombre y el total de los price sumados si no existe se agregara al un objeto vacio
    const restaurants = await pedidos.reduce((acc, pedido) => {
      const index = acc.findIndex(
        (item) => item.restaurantId === pedido.restaurantId,
      );
      if (index === -1) {
        acc.push({
          restaurantId: pedido.restaurantId,
          name: pedido.nameRestaurant,
          price: Number(pedido.price),
          count: 1, // Añade un contador para cada pedido
        });
      } else {
        acc[index].price += Number(pedido.price);
        acc[index].count += 1; // Incrementa el contador para cada pedido adicional
      }
      return acc;
    }, []);

    const resultRestaurant = restaurants.reduce(
      (max, restaurant) => (max.count > restaurant.count ? max : restaurant),
      restaurants[0],
    );

    let cantidadDieta = await pedidos.filter(
      (pedido) => pedido.typeMenu === 'D',
    ).length;
    let cantidadNormal = await pedidos.filter(
      (pedido) => pedido.typeMenu === 'N',
    ).length;
    let cantidadUsuarios = users.length;
    let collaborators = users.filter(
      (user) =>
        user.roles.includes(ROLES.COLLABORATOR) &&
        !user.roles.includes(ROLES.INTERN),
    ).length;
    let interns = users.filter(
      (user) =>
        user.roles.includes(ROLES.INTERN) &&
        !user.roles.includes(ROLES.COLLABORATOR),
    ).length;

    const pedidosByUsers = await this.getPedidosByUsers();

    return {
      totalPedidos,
      totalValor,
      restaurant: resultRestaurant,
      cantidadDieta,
      cantidadNormal,
      cantidadUsuarios,
      collaborators,
      interns,
      latestUsers,
      pedidosByUsers,
    };
  }

  async getUsers() {
    const users = await this.userService.getAll('', 1, 10, true);
    if (Array.isArray(users)) {
      return users.filter(
        (user) =>
          user.roles.includes(ROLES.COLLABORATOR) ||
          user.roles.includes(ROLES.INTERN),
      );
    }
    return [];
  }

  async getLatestUsers() {
    const users = await this.userService.getLastCreatedUsers();
    // se transforma la fecha de creacion de los usuarios al formato dd/mm/yyyy hh:mm:ss usando date-fns
    if (Array.isArray(users)) {
      return users.map((user) => {
        const result = user;
        return {
          ...result,
          createdAt: formatDate((user as any).createdAt, 'dd/MM/yyyy hh:mm:ss'),
          updatedAt: formatDate((user as any).updatedAt, 'dd/MM/yyyy hh:mm:ss'),
        };
      });
    }
    return [];
  }
  // aqui vamos a
  async getPedidosByUsers() {
    const pedidos = await this.pedidosService.getAllByDateRange({
      dateStart: '01/15/2024',
      dateEnd: '01/18/2024',
      all: true,
    });
    return pedidos;
  }
}
