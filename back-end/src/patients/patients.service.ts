import { Injectable, NotFoundException } from '@nestjs/common';

export type PatientProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  guardianName: string;
};

export type UpdatePatientProfileInput = Omit<PatientProfile, 'userId'>;

@Injectable()
export class PatientsService {
  private readonly patients: PatientProfile[] = [
    {
      userId: 'PAT001',
      firstName: 'Ria',
      lastName: 'Sharma',
      dob: '1990-10-24',
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '9473487399',
      email: 'ria@medbits.com',
      guardianName: 'Ravi Sharma',
    },
  ];

  getPatientByUserId(userId: string): PatientProfile {
    const patient = this.patients.find((item) => item.userId === userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return { ...patient };
  }

  updatePatientByUserId(
    userId: string,
    updates: UpdatePatientProfileInput,
  ): PatientProfile {
    const patientIndex = this.patients.findIndex((item) => item.userId === userId);
    if (patientIndex === -1) {
      throw new NotFoundException('Patient profile not found');
    }

    const nextPatient = {
      ...this.patients[patientIndex],
      ...updates,
      userId,
    };

    this.patients[patientIndex] = nextPatient;
    return { ...nextPatient };
  }
}
