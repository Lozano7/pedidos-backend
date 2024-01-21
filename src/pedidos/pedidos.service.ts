import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatDate } from 'src/utils';
import { PedidoDto } from './dto/pedido.dto';
import { Pedido, PedidoDocument } from './model/pedidos.model';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<PedidoDocument>,
  ) {}

  async register(body: PedidoDto) {
    const existingPedido = await this.isClientHasOrder(
      body.date,
      body.restaurantId,
      body.clientId,
    );
    if (existingPedido) {
      throw new NotFoundException('Ya tiene un pedido registrado en esa fecha');
    }

    const newPedido = await this.create(body);
    return this.formatResponse(newPedido);
  }

  async create(body: any) {
    const newPedido = new this.pedidoModel(body);
    return newPedido.save();
  }

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
    restaurantId: string = '',
    clientId: string = '',
  ): Promise<
    | {
        data: PedidoDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | PedidoDocument[]
  > {
    let response = null;

    //validar que si llega el id del restaurante se filtre por ese id en el query
    const query = search
      ? {
          $or: [{ date: { $regex: search, $options: 'i' } }],
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
        };

    if (all) {
      const pedidos = await this.pedidoModel.find(query).exec();
      response = pedidos.map((pedido) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: pedidoId } = pedido;
        const result = pedido.toJSON();
        return {
          ...result,
          _id: pedidoId.toString(),
        };
      });
    } else {
      const [data, total] = await Promise.all([
        this.pedidoModel
          .find(query)
          .limit(limit)
          .skip(limit * (page - 1))
          .exec(),
        this.pedidoModel.countDocuments(query).exec(),
      ]);
      response = {
        data,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getAllByDate(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
    date: string = formatDate(new Date()),
    restaurantId: string = '',
    clientId: string = '',
  ): Promise<
    | {
        data: PedidoDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | PedidoDocument[]
  > {
    let response = null;
    const query = search
      ? {
          $or: [{ date: { $regex: search, $options: 'i' } }],
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
          date,
        };

    if (all) {
      const pedidos = await this.pedidoModel.find(query).exec();
      response = pedidos.map((pedido) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: pedidoId } = pedido;
        const result = pedido.toJSON();
        return {
          ...result,
          _id: pedidoId.toString(),
        };
      });
    } else {
      const [data, total] = await Promise.all([
        this.pedidoModel
          .find(query)
          .limit(limit)
          .skip(limit * (page - 1))
          .exec(),
        this.pedidoModel.countDocuments(query).exec(),
      ]);
      response = {
        data,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async isClientHasOrder(date: string, restaurantId: string, clientId: string) {
    let dateFormated = date.split('-').join('/');
    const pedido = await this.pedidoModel.findOne({
      date: dateFormated,
      restaurantId,
      clientId,
    });
    return pedido;
  }

  async delete(date: string, restaurantId: string, clientId: string) {
    let dateFormated = date.split('-').join('/');
    const pedido = await this.pedidoModel.findOneAndDelete({
      date: dateFormated,
      restaurantId,
      clientId,
    });
    if (!pedido) {
      throw new NotFoundException('El pedido no existe');
    }
    return this.formatResponse(pedido);
  }

  async formatResponse(pedido: PedidoDocument | PedidoDocument[]) {
    let response = null;
    if (Array.isArray(pedido)) {
      response = pedido.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = pedido.toJSON();
      const { _id: rstrId } = pedido;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }

  //funcion que deveulve todos los pedidos del dia actual donde la fecha actual debe tener el siguiente formato dd/mm/yyyy
  async getAllByDateActual(dateParameter?: string): Promise<PedidoDocument[]> {
    let response = null;
    let date = dateParameter || formatDate(new Date());
    console.log('date', date);
    const query = {
      date,
    };

    const pedidos = await this.pedidoModel.find(query).exec();
    response = pedidos.map((pedido) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: pedidoId } = pedido;
      const result = pedido.toJSON();
      return {
        ...result,
        _id: pedidoId.toString(),
      };
    });

    return response;
  }

  // funcion que devuelve todos los pedidos entre date de incio y date de fin
  async getAllByDateRange({
    search = '',
    page = 1,
    limit = 10,
    all = false,
    dateStart = formatDate(new Date()),
    dateEnd = formatDate(new Date()),
    restaurantId = '',
    clientId = '',
  }: {
    search?: string;
    page?: number;
    limit?: number;
    all?: boolean;
    dateStart?: string;
    dateEnd?: string;
    restaurantId?: string;
    clientId?: string;
  }): Promise<
    | {
        data: PedidoDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | PedidoDocument[]
  > {
    let response = null;
    const query = search
      ? {
          $or: [{ date: { $regex: search, $options: 'i' } }],
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
          ...(clientId && { clientId }),
          date: { $gte: dateStart, $lte: dateEnd },
        };

    if (all) {
      const pedidos = await this.pedidoModel.find(query).exec();

      const pedidosFormated = await this.formatResponse(pedidos);

      // Lógica para organizar los reportes por usuario
      const reportes = {};
      pedidosFormated.forEach((pedido) => {
        if (!reportes[pedido.clientId]) {
          reportes[pedido.clientId] = {
            name: pedido.nameClient,
            roles: pedido.roles,
            pedidos: [],
          };
        }
        reportes[pedido.clientId].pedidos.push(pedido);
      });

      // Convertir el objeto a un array
      response = Object.values(reportes);
    } else {
      const [data, total] = await Promise.all([
        this.pedidoModel
          .find(query)
          .limit(limit)
          .skip(limit * (page - 1))
          .exec(),
        this.pedidoModel.countDocuments(query).exec(),
      ]);
      const pedidosFormated = await this.formatResponse(data);
      const reportes = {};
      pedidosFormated.forEach((pedido) => {
        if (!reportes[pedido.clientId]) {
          reportes[pedido.clientId] = {
            name: pedido.nameClient,
            roles: pedido.roles,
            pedidos: [],
          };
        }
        reportes[pedido.clientId].pedidos.push(pedido);
      });

      response = {
        data: Object.values(reportes),
        total,
        page,
        limit,
      };
    }
    return response;
  }
}
