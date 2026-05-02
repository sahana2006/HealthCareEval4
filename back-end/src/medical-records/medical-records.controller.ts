import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateMedicalRecordInput,
  MedicalRecordsService,
} from './medical-records.service';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get(':patientId')
  getRecordsByPatientId(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getRecordsByPatientId(patientId);
  }

  @Post()
  createRecord(@Body() body: Partial<CreateMedicalRecordInput>) {
    return this.medicalRecordsService.createRecord({
      doctorId: body.doctorId?.trim() ?? '',
      patientId: body.patientId?.trim() ?? '',
      type: body.type ?? 'consultation',
      doctorName: body.doctorName?.trim() ?? '',
      specialization: body.specialization?.trim() ?? '',
      date: body.date?.trim(),
      consultationNote: body.consultationNote?.trim(),
      medicines: body.medicines?.trim(),
      followUp: body.followUp?.trim(),
      tests: body.tests?.trim(),
      lifestyle: body.lifestyle?.trim(),
      diet: body.diet?.trim(),
      duration: body.duration?.trim(),
    });
  }
}
