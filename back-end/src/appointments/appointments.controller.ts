import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AppointmentsService,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Header('Cache-Control', 'no-store')
  @Roles('frontdesk')
  @Get()
  getAppointments(
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.listAppointments({
      status,
    });
  }

  @Roles('patient', 'frontdesk')
  @Post()
  createAppointment(@Body() body: Partial<CreateAppointmentInput>) {
    return this.appointmentsService.createAppointment({
      userId: body.userId?.trim() ?? '',
      doctorId: body.doctorId?.trim() ?? '',
      date: body.date?.trim() ?? '',
      slot: body.slot?.trim() ?? '',
    });
  }

  @Header('Cache-Control', 'no-store')
  @Roles('patient')
  @Get('user/:userId')
  getAppointmentsByUserId(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ) {
    console.log('Appointments API hit', userId);
    return this.appointmentsService.getAppointmentsByUserId(userId, status);
  }

  @Roles('patient', 'frontdesk')
  @Get('completed/:userId')
  getCompletedAppointmentsByUserId(@Param('userId') userId: string) {
    return this.appointmentsService.getCompletedAppointmentsByUserId(userId);
  }

  @Roles('doctor', 'frontdesk')
  @Get('doctor/:doctorId')
  getAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.getAppointmentsByDoctorId(doctorId);
  }

  @Roles('patient', 'frontdesk')
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

  @Roles('patient', 'doctor', 'frontdesk')
  @Delete(':id')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(id);
  }
}
