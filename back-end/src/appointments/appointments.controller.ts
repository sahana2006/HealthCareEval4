import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  AppointmentsService,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  createAppointment(@Body() body: Partial<CreateAppointmentInput>) {
    return this.appointmentsService.createAppointment({
      userId: body.userId?.trim() ?? '',
      doctorId: body.doctorId?.trim() ?? '',
      date: body.date?.trim() ?? '',
      slot: body.slot?.trim() ?? '',
    });
  }

  @Get('user/:userId')
  getAppointmentsByUserId(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.getAppointmentsByUserId(userId, status);
  }

  @Get('completed/:userId')
  getCompletedAppointmentsByUserId(@Param('userId') userId: string) {
    return this.appointmentsService.getCompletedAppointmentsByUserId(userId);
  }

  @Get('doctor/:doctorId')
  getAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.getAppointmentsByDoctorId(doctorId);
  }

  @Put(':id')
  updateAppointment(
    @Param('id') id: string,
    @Body() body: Partial<UpdateAppointmentInput>,
  ) {
    return this.appointmentsService.updateAppointment(id, {
      date: body.date?.trim(),
      slot: body.slot?.trim(),
    });
  }
}
