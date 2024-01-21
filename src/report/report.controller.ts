import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as excel from 'exceljs';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReportService } from './report.service';

@Controller('report')
@UseGuards(AuthGuard, RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles('ADMIN')
  @Get('/dashboard')
  async getDashboardData() {
    return this.reportService.getDashboardData();
  }

  @Roles('ADMIN')
  @Get('/dashboard/consumption')
  async getDashboardConsumption(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getPedidosByUsers({
      page,
      limit,
      search,
      all,
      startDate,
      endDate,
    });
  }

  @Roles('ADMIN')
  @Post('/dashboard/generate-exel')
  async getReportExel(
    @Body() data: { name: string; pedidos: any[] },
    @Res() res: Response,
  ) {
    const { name, pedidos } = data;

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos');

    // Agregar encabezados
    worksheet.addRow([
      'Nombre',
      'Restaurante',
      'Fecha',
      'Tipo de Menú',
      'Precio',
    ]);

    // Agregar datos
    pedidos.forEach((pedido) => {
      worksheet.addRow([
        pedido.nameClient,
        pedido.nameRestaurant,
        pedido.date,
        pedido.typeMenu,
        pedido.price,
      ]);
    });

    // Configurar la respuesta HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${name}_pedidos.xlsx`,
    );

    // Enviar el archivo Excel como respuesta
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }
}
