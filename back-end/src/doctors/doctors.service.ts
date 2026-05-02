import { Injectable, NotFoundException } from '@nestjs/common';

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;       // years
  age: number;
  gender: string;
  email: string;
  phone: string;
  licenseNo: string;
  bio: string;
  slots: string[];
};

@Injectable()
export class DoctorsService {
  private readonly doctors: Doctor[] = [
    {
      id: 'DOC001',
      name: 'Dr. S Madhuri',
      specialization: 'Dermatologist',
      department: 'Dermatology',
      qualification: 'MBBS, MD - Dermatology',
      experience: 12,
      age: 38,
      gender: 'Female',
      email: 'madhuri@medbits.com',
      phone: '9876541001',
      licenseNo: 'MCI-DRM-2012-001',
      bio: 'Specialist in skin disorders, cosmetic dermatology and laser treatments with 12 years of clinical experience.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC002',
      name: 'Dr. Ashwini Ray',
      specialization: 'Dermatologist',
      department: 'Dermatology',
      qualification: 'MBBS, DNB - Dermatology',
      experience: 8,
      age: 34,
      gender: 'Female',
      email: 'ashwini.ray@medbits.com',
      phone: '9876541002',
      licenseNo: 'MCI-DRM-2016-002',
      bio: 'Focused on pediatric dermatology, eczema management and phototherapy.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC003',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      qualification: 'MBBS, MD, DM - Cardiology',
      experience: 15,
      age: 44,
      gender: 'Female',
      email: 'sarah.johnson@medbits.com',
      phone: '9384751206',
      licenseNo: 'MCI-CAR-2009-003',
      bio: 'Interventional cardiologist specializing in angioplasty, heart failure management and preventive cardiology.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC004',
      name: 'Dr. Ramesh Iyer',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      qualification: 'MBBS, MD, DM - Cardiology',
      experience: 20,
      age: 50,
      gender: 'Male',
      email: 'ramesh.iyer@medbits.com',
      phone: '9876541004',
      licenseNo: 'MCI-CAR-2004-004',
      bio: 'Senior cardiologist with expertise in echocardiography, cardiac arrhythmias and valve disorders.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC005',
      name: 'Dr. Paul Johnson',
      specialization: 'Pediatrician',
      department: 'Paediatrics',
      qualification: 'MBBS, MD - Paediatrics',
      experience: 10,
      age: 39,
      gender: 'Male',
      email: 'paul.johnson@medbits.com',
      phone: '9876541005',
      licenseNo: 'MCI-PED-2014-005',
      bio: 'Dedicated to child health and development, neonatal care, and adolescent medicine.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC006',
      name: 'Dr. Robert Wilson',
      specialization: 'Orthopedic',
      department: 'Orthopaedics',
      qualification: 'MBBS, MS - Orthopaedics',
      experience: 18,
      age: 47,
      gender: 'Male',
      email: 'robert.wilson@medbits.com',
      phone: '9876541006',
      licenseNo: 'MCI-ORT-2006-006',
      bio: 'Expert in joint replacement, sports injuries, spine surgery and trauma management.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC007',
      name: 'Dr. Anita Gupta',
      specialization: 'Neurologist',
      department: 'Neurology',
      qualification: 'MBBS, MD, DM - Neurology',
      experience: 14,
      age: 43,
      gender: 'Female',
      email: 'anita.gupta@medbits.com',
      phone: '9876541007',
      licenseNo: 'MCI-NEU-2010-007',
      bio: 'Specialist in epilepsy, migraine, stroke management and neurodegenerative disorders.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC008',
      name: 'Dr. Kavita Sharma',
      specialization: 'General',
      department: 'General Medicine',
      qualification: 'MBBS, MD - General Medicine',
      experience: 9,
      age: 36,
      gender: 'Female',
      email: 'kavita.sharma@medbits.com',
      phone: '9876541008',
      licenseNo: 'MCI-GEN-2015-008',
      bio: 'Primary care physician with focus on preventive medicine, chronic disease management and patient wellness.',
      slots: ['10:00', '10:30', '11:00', '11:30', '12:00'],
    },
    {
      id: 'DOC009',
      name: 'Dr. Vikram Nair',
      specialization: 'General',
      department: 'General Medicine',
      qualification: 'MBBS, MD - General Medicine',
      experience: 11,
      age: 40,
      gender: 'Male',
      email: 'vikram.nair@medbits.com',
      phone: '9876541009',
      licenseNo: 'MCI-GEN-2013-009',
      bio: 'Experienced general physician managing acute and chronic conditions with emphasis on holistic patient care.',
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
