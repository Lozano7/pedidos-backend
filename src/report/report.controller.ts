import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
