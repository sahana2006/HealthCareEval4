import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  listDoctors(@Query('specialization') specialization?: string) {
    return this.doctorsService.findAll(specialization);
  }

  @Get(':doctorId/slots')
  getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ) {
    const doctor = this.doctorsService.getDoctorById(doctorId);
    if (!date?.trim()) {
      return doctor.slots;
    }

    return this.appointmentsService.getAvailableSlots(doctorId, date.trim());
  }
}
