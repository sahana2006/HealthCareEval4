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

export type UpdateAppointmentInput = {
  date?: string;
  slot?: string;
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
    {
      id: 'APT002',
      userId: 'PAT001',
      doctorId: 'DOC002',
      date: '2026-04-01',
      slot: '11:00',
      status: 'completed',
    },
    {
      id: 'APT003',
      userId: 'PAT001',
      doctorId: 'DOC008',
      date: '2026-05-02',
      slot: '10:30',
      status: 'upcoming',
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

  getAppointmentsByUserId(userId: string, status?: string) {
    const normalizedStatus =
      status === 'upcoming' || status === 'completed' ? status : undefined;

    return this.appointments
      .filter((appointment) => {
        if (appointment.userId !== userId) {
          return false;
        }

        return normalizedStatus ? appointment.status === normalizedStatus : true;
      })
      .map((appointment) => this.toAppointmentDetails(appointment));
  }

  getCompletedAppointmentsByUserId(userId: string) {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.userId === userId && appointment.status === 'completed',
      )
      .map((appointment) => this.toAppointmentDetails(appointment));
  }

  getAppointmentsByDoctorId(doctorId: string) {
    return this.appointments
      .filter((appointment) => appointment.doctorId === doctorId)
      .map((appointment) => this.toAppointmentDetails(appointment));
  }

  hasCompletedAppointment(userId: string, doctorId: string): boolean {
    return this.appointments.some(
      (appointment) =>
        appointment.userId === userId &&
        appointment.doctorId === doctorId &&
        appointment.status === 'completed',
    );
  }

  updateAppointment(appointmentId: string, input: UpdateAppointmentInput) {
    const appointment = this.appointments.find((item) => item.id === appointmentId);
    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.status !== 'upcoming') {
      throw new BadRequestException('Only upcoming appointments can be modified');
    }

    const nextDate = input.date?.trim() || appointment.date;
    const nextSlot = input.slot?.trim() || appointment.slot;
    if (!nextDate || !nextSlot) {
      throw new BadRequestException('date and slot are required');
    }

    const doctor = this.doctorsService.getDoctorById(appointment.doctorId);
    if (!doctor.slots.includes(nextSlot)) {
      throw new BadRequestException('Invalid doctor slot');
    }

    const isAlreadyBooked = this.appointments.some(
      (item) =>
        item.id !== appointmentId &&
        item.doctorId === appointment.doctorId &&
        item.date === nextDate &&
        item.slot === nextSlot,
    );
    if (isAlreadyBooked) {
      throw new BadRequestException('This slot is already booked');
    }

    appointment.date = nextDate;
    appointment.slot = nextSlot;

    return this.toAppointmentDetails(appointment);
  }

  cancelAppointment(appointmentId: string) {
    const appointmentIndex = this.appointments.findIndex(
      (item) => item.id === appointmentId,
    );
    if (appointmentIndex === -1) {
      throw new BadRequestException('Appointment not found');
    }

    const appointment = this.appointments[appointmentIndex];
    if (appointment.status !== 'upcoming') {
      throw new BadRequestException('Only upcoming appointments can be cancelled');
    }

    const [cancelledAppointment] = this.appointments.splice(appointmentIndex, 1);
    return this.toAppointmentDetails(cancelledAppointment);
  }

  private toAppointmentDetails(appointment: Appointment) {
    const doctor = this.doctorsService.getDoctorById(appointment.doctorId);

    return {
      ...appointment,
      doctor,
    };
  }
}
