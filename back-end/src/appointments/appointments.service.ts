import { BadRequestException, Injectable } from '@nestjs/common';
import { DoctorsService } from '../doctors/doctors.service';

export type AppointmentStatus = 'upcoming' | 'completed';

export type Appointment = {
  id: string;
  userId: string;
  doctorId: string;
  date: string;
  slot: string;
  status: AppointmentStatus;
};

export type CreateAppointmentInput = {
  userId: string;
  doctorId: string;
  date: string;
  slot: string;
};

@Injectable()
export class AppointmentsService {
  private readonly appointments: Appointment[] = [
    {
      id: 'APT001',
      userId: 'PAT001',
      doctorId: 'DOC003',
      date: '2026-03-01',
      slot: '10:00',
      status: 'completed',
    },
  ];

  constructor(private readonly doctorsService: DoctorsService) {}

  getAvailableSlots(doctorId: string, date: string): string[] {
    const doctor = this.doctorsService.getDoctorById(doctorId);
    const bookedSlots = new Set(
      this.appointments
        .filter(
          (appointment) =>
            appointment.doctorId === doctorId && appointment.date === date,
        )
        .map((appointment) => appointment.slot),
    );

    return doctor.slots.filter((slot) => !bookedSlots.has(slot));
  }

  createAppointment(input: CreateAppointmentInput) {
    if (!input.userId || !input.doctorId || !input.date || !input.slot) {
      throw new BadRequestException(
        'userId, doctorId, date and slot are required',
      );
    }

    const doctor = this.doctorsService.getDoctorById(input.doctorId);
    if (!doctor.slots.includes(input.slot)) {
      throw new BadRequestException('Invalid doctor slot');
    }

    const isAlreadyBooked = this.appointments.some(
      (appointment) =>
        appointment.doctorId === input.doctorId &&
        appointment.date === input.date &&
        appointment.slot === input.slot,
    );
    if (isAlreadyBooked) {
      throw new BadRequestException('This slot is already booked');
    }

    const appointment: Appointment = {
      id: `APT${Date.now()}`,
      userId: input.userId,
      doctorId: input.doctorId,
      date: input.date,
      slot: input.slot,
      status: 'upcoming',
    };

    this.appointments.unshift(appointment);
    return this.toAppointmentDetails(appointment);
  }

  getAppointmentsByUserId(userId: string) {
    return this.appointments
      .filter((appointment) => appointment.userId === userId)
      .map((appointment) => this.toAppointmentDetails(appointment));
  }

  getAppointmentsByDoctorId(doctorId: string) {
    return this.appointments
      .filter((appointment) => appointment.doctorId === doctorId)
      .map((appointment) => this.toAppointmentDetails(appointment));
  }

  private toAppointmentDetails(appointment: Appointment) {
    const doctor = this.doctorsService.getDoctorById(appointment.doctorId);

    return {
      ...appointment,
      doctor,
    };
  }
}
