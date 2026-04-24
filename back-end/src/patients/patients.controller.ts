import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Put,
} from '@nestjs/common';
import {
  PatientsService,
  UpdatePatientProfileInput,
} from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':userId')
  getPatientProfile(
    @Param('userId') userId: string,
    @Headers('role') role?: string,
  ) {
    this.assertPatientRole(role);
    return this.patientsService.getPatientByUserId(userId);
  }

  @Put(':userId')
  updatePatientProfile(
    @Param('userId') userId: string,
    @Headers('role') role: string | undefined,
    @Body() body: Partial<UpdatePatientProfileInput>,
  ) {
    this.assertPatientRole(role);

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

  private assertPatientRole(role?: string) {
    if (role !== 'patient') {
      throw new ForbiddenException('Patient role header is required');
    }
  }
}
