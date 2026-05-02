import { BadRequestException, Injectable } from '@nestjs/common';

export type MedicalRecordType = 'consultation' | 'treatment' | 'lab';

export type MedicalRecord = {
  id: string;
  doctorId: string;
  patientId: string;
  type: MedicalRecordType;
  doctorName: string;
  specialization: string;
  date: string;
  consultationNote?: string;
  medicines?: string;
  followUp?: string;
  // Treatment plan specific fields
  tests?: string;
  lifestyle?: string;
  diet?: string;
  duration?: string;
};

export type CreateMedicalRecordInput = {
  doctorId: string;
  patientId: string;
  type: MedicalRecordType;
  doctorName: string;
  specialization: string;
  date?: string;
  consultationNote?: string;
  medicines?: string;
  followUp?: string;
  tests?: string;
  lifestyle?: string;
  diet?: string;
  duration?: string;
};

@Injectable()
export class MedicalRecordsService {
  private readonly medicalRecords: MedicalRecord[] = [
    {
      id: 'MR001',
      doctorId: 'DOC001',
      patientId: 'PAT001',
      type: 'consultation',
      doctorName: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
      date: '2026-03-10',
      consultationNote:
        'Reviewed recurring skin irritation and advised trigger avoidance plus hydration.',
      medicines: 'Cetirizine 10mg once daily, Calamine lotion twice daily',
      followUp: '2026-05-10',
    },
    {
      id: 'MR002',
      doctorId: 'DOC001',
      patientId: 'PAT001',
      type: 'treatment',
      doctorName: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
      date: '2026-03-10',
      medicines: 'Cetirizine 10mg, Calamine lotion',
      tests: 'Patch test',
      lifestyle: 'Avoid harsh soaps and synthetic fabrics',
      diet: 'Increase omega-3 rich foods',
      duration: '4 weeks',
    },
    {
      id: 'MR003',
      doctorId: 'DOC001',
      patientId: 'PAT001',
      type: 'lab',
      doctorName: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
      date: '2026-03-10',
    },
  ];

  getRecordsByPatientId(patientId: string) {
    return this.medicalRecords.filter((record) => record.patientId === patientId);
  }

  createRecord(input: CreateMedicalRecordInput): MedicalRecord {
    if (!input.doctorId || !input.patientId || !input.type) {
      throw new BadRequestException('doctorId, patientId, and type are required');
    }

    const allowedTypes: MedicalRecordType[] = ['consultation', 'treatment', 'lab'];
    if (!allowedTypes.includes(input.type)) {
      throw new BadRequestException(`type must be one of: ${allowedTypes.join(', ')}`);
    }

    const record: MedicalRecord = {
      id: `MR${Date.now()}`,
      doctorId: input.doctorId,
      patientId: input.patientId,
      type: input.type,
      doctorName: input.doctorName?.trim() || 'Unknown Doctor',
      specialization: input.specialization?.trim() || 'General',
      date: input.date?.trim() || new Date().toISOString().split('T')[0],
      consultationNote: input.consultationNote?.trim(),
      medicines: input.medicines?.trim(),
      followUp: input.followUp?.trim(),
      tests: input.tests?.trim(),
      lifestyle: input.lifestyle?.trim(),
      diet: input.diet?.trim(),
      duration: input.duration?.trim(),
    };

    this.medicalRecords.unshift(record);
    return { ...record };
  }
}
