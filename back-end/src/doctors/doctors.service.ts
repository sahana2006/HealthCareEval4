import { Injectable, NotFoundException } from '@nestjs/common';

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  slots: string[];
};

@Injectable()
export class DoctorsService {
  private readonly doctors: Doctor[] = [
    {
      id: 'DOC001',
      name: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC002',
      name: 'Dr. Ashwini Ray',
      specialization: 'Dermatologist',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC003',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC004',
      name: 'Dr. Ramesh Iyer',
      specialization: 'Cardiologist',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC005',
      name: 'Dr. Paul Johnson',
      specialization: 'Pediatrician',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC006',
      name: 'Dr. Robert Wilson',
      specialization: 'Orthopedic',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC007',
      name: 'Dr. Anita Gupta',
      specialization: 'Neurologist',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC008',
      name: 'Dr. Kavita Sharma',
      specialization: 'General',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC009',
      name: 'Dr. Vikram Nair',
      specialization: 'General',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
  ];

  findAll(specialization?: string): Doctor[] {
    const normalizedSpecialization = specialization?.trim();
    const doctors = normalizedSpecialization
      ? this.doctors.filter(
          (doctor) => doctor.specialization === normalizedSpecialization,
        )
      : this.doctors;

    return doctors.map((doctor) => ({ ...doctor, slots: [...doctor.slots] }));
  }

  getDoctorById(doctorId: string): Doctor {
    const doctor = this.doctors.find((item) => item.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return { ...doctor, slots: [...doctor.slots] };
  }
}
