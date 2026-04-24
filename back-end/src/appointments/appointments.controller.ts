import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  AppointmentsService,
  CreateAppointmentInput,
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
  getAppointmentsByUserId(@Param('userId') userId: string) {
    return this.appointmentsService.getAppointmentsByUserId(userId);
  }

  @Get('completed/:userId')
  getCompletedAppointmentsByUserId(@Param('userId') userId: string) {
    return this.appointmentsService.getCompletedAppointmentsByUserId(userId);
  }

  @Get('doctor/:doctorId')
  getAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.getAppointmentsByDoctorId(doctorId);
  }
}
