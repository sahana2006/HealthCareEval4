import {
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import {
  PatientsService,
  UpdatePatientProfileInput,
} from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles('patient', 'doctor', 'frontdesk')
  @Get(':userId')
  getPatientProfile(@Param('userId') userId: string) {
    return this.patientsService.getPatientByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Put(':userId')
  updatePatientProfile(
    @Param('userId') userId: string,
    @Body() body: Partial<UpdatePatientProfileInput>,
  ) {
    return this.patientsService.updatePatientByUserId(userId, {
      firstName: body.firstName?.trim() ?? '',
      lastName: body.lastName?.trim() ?? '',
      dob: body.dob?.trim() ?? '',
      gender: body.gender?.trim() ?? '',
      bloodGroup: body.bloodGroup?.trim() ?? '',
      phone: body.phone?.trim() ?? '',
      email: body.email?.trim() ?? '',
      guardianName: body.guardianName?.trim() ?? '',
    });
  }
}
