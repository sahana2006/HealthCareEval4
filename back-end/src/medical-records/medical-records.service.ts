import { Injectable } from '@nestjs/common';

export type MedicalRecordType = 'consultation' | 'treatment' | 'lab';

export type MedicalRecord = {
  id: string;
  doctorId: string;
  patientId: string;
  type: MedicalRecordType;
  doctorName: string;
  specialization: string;
  consultationNote?: string;
  medicines?: string;
  followUp?: string;
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
    },
    {
      id: 'MR003',
      doctorId: 'DOC001',
      patientId: 'PAT001',
      type: 'lab',
      doctorName: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
    },
  ];

  getRecordsByPatientId(patientId: string) {
    return this.medicalRecords.filter((record) => record.patientId === patientId);
  }
}
