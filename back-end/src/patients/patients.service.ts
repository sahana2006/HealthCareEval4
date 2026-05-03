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
    {
      userId: 'PAT002',
      firstName: 'Arun',
      lastName: 'Menon',
      dob: '1988-02-28',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '9123456780',
      email: 'arun.menon@medbits.com',
      guardianName: 'Lakshmi Menon',
    },
    {
      userId: 'PAT003',
      firstName: 'Farah',
      lastName: 'Ali',
      dob: '2001-11-06',
      gender: 'Female',
      bloodGroup: 'A-',
      phone: '9988776655',
      email: 'farah.ali@medbits.com',
      guardianName: 'Imran Ali',
    },
    {
      userId: 'PAT004',
      firstName: 'Dev',
      lastName: 'Patel',
      dob: '1992-07-19',
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '9012345678',
      email: 'dev.patel@medbits.com',
      guardianName: 'Kiran Patel',
    },
  ];

  getPatientByUserId(userId: string): PatientProfile {
    const patient = this.patients.find((item) => item.userId === userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return { ...patient };
  }

  getAllPatients(): PatientProfile[] {
    return this.patients.map((patient) => ({ ...patient }));
  }

  createPatientProfile(profile: PatientProfile): PatientProfile {
    this.patients.push({ ...profile });
    return { ...profile };
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
