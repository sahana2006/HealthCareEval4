import { Injectable } from '@nestjs/common';
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
}
