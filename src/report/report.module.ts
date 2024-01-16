import { Module } from '@nestjs/common';
import { PedidosModule } from 'src/pedidos/pedidos.module';
import { UsersModule } from 'src/users/users.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [PedidosModule, UsersModule],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}
