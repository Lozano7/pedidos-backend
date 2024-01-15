import { Injectable } from '@nestjs/common';
import { PedidosService } from 'src/pedidos/pedidos.service';

@Injectable()
export class ReportService {
  constructor(private pedidosService: PedidosService) {}
}
