import { Controller, Get, Param } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get(':patientId')
  getRecordsByPatientId(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getRecordsByPatientId(patientId);
  }
}
