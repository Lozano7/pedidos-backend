import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import * as excel from 'exceljs';
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
    @Query('roles') roles: string,
  ) {
    return this.reportService.getPedidosByUsers({
      page,
      limit,
      search,
      all,
      startDate,
      endDate,
      roles,
    });
  }

  @Roles('ADMIN')
  @Post('/dashboard/generate-exel')
  async getReportExel(
    @Body() data: { name: string; pedidos: any[] },
  ): Promise<string> {
    const { name, pedidos } = data;

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos');

    // Configurar estilo de fuente para encabezados
    const headerFont = {
      name: 'Arial',
      size: 12,
      bold: true,
    };

    // Configurar estilo de fuente para datos
    const dataFont = {
      name: 'Arial',
      size: 11,
    };

    // Configurar estilos adicionales para total
    const totalStyles = {
      font: { ...headerFont, bold: true, color: { argb: '87CEFA' } }, // Color azul pastel para resaltar el total
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '87CEFA' }, // Color azul pastel para resaltar el total
      },
    };

    // Agregar encabezados
    worksheet.addRow([
      'Nombre',
      'Restaurante',
      'Fecha',
      'Tipo de Menú',
      'Sopa',
      'Segundo',
      'Bebida',
      'Postre',
      'Precio',
    ]);
    worksheet.getRow(1).font = headerFont;

    // Agregar datos
    pedidos.forEach((pedido) => {
      worksheet.addRow([
        pedido.nameClient,
        pedido.nameRestaurant,
        pedido.date,
        pedido.typeMenu === 'N' ? 'Normal' : 'Dieta',
        pedido.soup,
        pedido.second,
        pedido.drink,
        pedido.dessert,
        pedido.price,
      ]);
    });

    // Agregar fila adicional para el total de precios
    const totalRow = worksheet.addRow([
      'Total $',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      { formula: `SUM(I2:I${worksheet.rowCount - 1})` },
    ]);
    this.configurarEstilos(totalRow, totalStyles, totalStyles);

    // Aplicar estilo de fuente a todas las filas de datos
    worksheet.getRows(2, worksheet.rowCount).forEach((row) => {
      this.configurarEstilos(row, dataFont, {});
    });

    // Obtener el ArrayBuffer del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Convertir el ArrayBuffer a base64
    const base64 = Buffer.from(buffer).toString('base64');

    return base64;
  }

  @Roles('ADMIN')
  @Post('/dashboard/generate-exel/all-clients')
  async generarExcelAllClients(@Body() data: any[]): Promise<string> {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos');

    // Configurar estilo de fuente para encabezados
    const headerFont = {
      name: 'Arial',
      size: 12,
      bold: true,
    };

    // Configurar estilo de fuente para datos
    const dataFont = {
      name: 'Arial',
      size: 11,
    };

    // Configurar estilos adicionales para resaltar cliente
    const clienteStyles = {
      font: dataFont,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDAB9' }, // Color melocotón claro para resaltar el cliente
      },
    };

    // Configurar estilos adicionales para datos de pedidos
    const pedidoStyles = {
      font: dataFont,
      border: { bottom: { style: 'thin' } },
      // ... otros estilos según sea necesario ...
    };

    // Configurar estilos adicionales para total
    const totalStyles = {
      font: { ...headerFont, bold: true }, // Color azul pastel para resaltar el total
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '87CEFA' }, // Color azul pastel para resaltar el total
      },
    };

    // Configurar estilos adicionales para total global
    const totalGlobalStyles = {
      font: { ...headerFont, bold: true }, // Color melocotón claro para resaltar el total global
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0044' }, // Color melocotón claro para resaltar el total global
      },
    };

    // Iterar sobre cada elemento del array
    data.forEach((cliente, index) => {
      const { name, roles, clientId, pedidos } = cliente;

      // Añadir espacio entre clientes
      if (index > 0) {
        worksheet.addRow([]); // Añadir una fila vacía
      }

      // Configurar encabezados
      const headerRow = worksheet.addRow(['Nombre', 'Roles', 'ID']);
      this.configurarEstilos(headerRow, headerFont, clienteStyles);

      // Configurar datos del cliente
      const clienteRow = worksheet.addRow([name, roles.join(', '), clientId]);
      this.configurarEstilos(clienteRow, dataFont, clienteStyles);

      // Configurar encabezados de pedidos
      const pedidosHeaderRow = worksheet.addRow([
        'Restaurante',
        'Fecha',
        'Tipo de Menú',
        'Sopa',
        'Segundo',
        'Bebida',
        'Postre',
        'Precio',
      ]);
      this.configurarEstilos(pedidosHeaderRow, headerFont, pedidoStyles);

      // Agregar datos de pedidos
      pedidos.forEach((pedido) => {
        const pedidoRow = worksheet.addRow([
          pedido.nameRestaurant,
          pedido.date,
          pedido.typeMenu === 'N' ? 'Normal' : 'Dieta',
          pedido.soup,
          pedido.second,
          pedido.drink,
          pedido.dessert,
          pedido.price,
        ]);
        this.configurarEstilos(pedidoRow, dataFont, pedidoStyles);
      });

      // Añadir fila adicional para el total de precios
      const totalRow = worksheet.addRow([
        'Total',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        {
          formula: `SUM(H${pedidosHeaderRow.number + 1}:H${
            worksheet.rowCount - 1
          })`,
        },
      ]);
      this.configurarEstilos(totalRow, totalStyles, totalStyles);
    });

    // Añadir fila adicional para el total global de precios
    const totalGlobalRow = worksheet.addRow([
      'Total Global $',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      { formula: `SUM(H2:H${worksheet.rowCount - 1})` },
    ]);
    this.configurarEstilos(
      totalGlobalRow,
      totalGlobalStyles,
      totalGlobalStyles,
    );

    // Obtener el ArrayBuffer del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Convertir el ArrayBuffer a base64
    const base64 = Buffer.from(buffer).toString('base64');

    return base64;
  }

  // Función para configurar estilos
  private configurarEstilos(row: excel.Row, font: any, styles: any) {
    row.font = font;
    row.eachCell((cell) => {
      Object.keys(styles).forEach((style) => {
        cell[style] = styles[style];
      });
    });
  }
}
