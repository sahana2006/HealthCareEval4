import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service';

export type UserRole = 'admin' | 'patient' | 'doctor' | 'frontdesk';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type SafeUser = Omit<User, 'password'> & {
  firstName?: string;
  lastName?: string;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  guardianName: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly patientsService: PatientsService) {}

  private readonly users: User[] = [
    {
      id: 'ADM001',
      name: 'Admin User',
      email: 'admin@medbits.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 'PAT001',
      name: 'Ria Sharma',
      email: 'ria@medbits.com',
      password: 'patient123',
      role: 'patient',
    },
    {
      id: 'DOC001',
      name: 'Dr. S Madhuri',
      email: 'madhuri@medbits.com',
      password: 'doctor123',
      role: 'doctor',
    },
    {
      id: 'FD001',
      name: 'Priya Nair',
      email: 'frontdesk@medbits.com',
      password: 'desk123',
      role: 'frontdesk',
    },
  ];

  login(email: string, password: string): SafeUser | null {
    const user = this.users.find((item) => item.email === email);
    if (!user || user.password !== password) {
      return null;
    }

    const { password: _password, ...safeUser } = user;
    if (safeUser.role !== 'patient') {
      return safeUser;
    }

    const patientProfile = this.patientsService.getPatientByUserId(safeUser.id);

    return {
      ...safeUser,
      firstName: patientProfile.firstName,
      lastName: patientProfile.lastName,
    };
  }

  signupPatient(input: SignupInput): SafeUser {
    const email = input.email.trim().toLowerCase();
    if (this.users.some((item) => item.email.toLowerCase() === email)) {
      throw new BadRequestException('Email is already registered');
    }

    const nextId = this.generateNextPatientId();
    const safeName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

    const user: User = {
      id: nextId,
      name: safeName,
      email,
      password: input.password,
      role: 'patient',
    };

    this.users.push(user);
    this.patientsService.createPatientProfile({
      userId: nextId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      dob: input.dob.trim(),
      gender: input.gender.trim(),
      bloodGroup: input.bloodGroup.trim(),
      phone: input.phone.trim(),
      email,
      guardianName: input.guardianName.trim(),
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
    };
  }

  private generateNextPatientId(): string {
    const patientIds = this.users
      .filter((item) => item.role === 'patient')
      .map((item) => Number.parseInt(item.id.replace('PAT', ''), 10))
      .filter((value) => Number.isFinite(value));

    const nextNumber = (patientIds.length ? Math.max(...patientIds) : 0) + 1;
    return `PAT${nextNumber.toString().padStart(3, '0')}`;
  }
}
