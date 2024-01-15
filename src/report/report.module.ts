import { Module } from '@nestjs/common';
import { PedidosModule } from 'src/pedidos/pedidos.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [PedidosModule],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}
