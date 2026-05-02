import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import {
  CreateLabAssignmentInput,
  CreateTestBookingInput,
  LabTestsService,
  UpdateLabAssignmentInput,
} from './labtests.service';

@Controller('labtests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Roles('patient', 'doctor', 'frontdesk')
  @Get()
  listLabTests() {
    return this.labTestsService.findAllTests();
  }

  @Roles('patient', 'frontdesk')
  @Post('book')
  createBooking(@Body() body: Partial<CreateTestBookingInput>) {
    return this.labTestsService.createBooking({
      userId: body.userId?.trim() ?? '',
      labTestId: body.labTestId?.trim() ?? '',
    });
  }

  @Roles('patient', 'frontdesk')
  @Get('cart/:userId')
  getCartBookings(@Param('userId') userId: string) {
    return this.labTestsService.getCartBookingsByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Post('confirm/:userId')
  confirmBookings(@Param('userId') userId: string) {
    return this.labTestsService.confirmBookingsByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Get('history/:userId')
  getBookingHistory(@Param('userId') userId: string) {
    return this.labTestsService.getBookingHistoryByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Delete('cart/:bookingId')
  removeCartBooking(@Param('bookingId') bookingId: string) {
    return this.labTestsService.removeCartBooking(bookingId);
  }

  @Roles('doctor', 'frontdesk')
  @Post('assignments')
  createLabAssignment(@Body() body: Partial<CreateLabAssignmentInput>) {
    return this.labTestsService.createLabAssignment({
      userId: body.userId?.trim() ?? '',
      patientName: body.patientName?.trim() ?? '',
      doctorId: body.doctorId?.trim() ?? '',
      doctorName: body.doctorName?.trim() ?? '',
      packageName: body.packageName?.trim(),
      tests: Array.isArray(body.tests) ? body.tests : [],
      remarks: body.remarks?.trim(),
    });
  }

  @Roles('patient', 'doctor', 'frontdesk')
  @Get('assignments/user/:userId')
  getAssignmentsByUserId(@Param('userId') userId: string) {
    return this.labTestsService.getAssignmentsByUserId(userId);
  }

  @Roles('doctor', 'frontdesk')
  @Get('assignments/doctor/:doctorId')
  getAssignmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.labTestsService.getAssignmentsByDoctorId(doctorId);
  }

  @Roles('doctor', 'frontdesk')
  @Put('assignments/:assignmentId')
  updateLabAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() body: Partial<UpdateLabAssignmentInput>,
  ) {
    return this.labTestsService.updateLabAssignment(assignmentId, {
      userId: body.userId?.trim(),
      patientName: body.patientName?.trim(),
      packageName: body.packageName,
      tests: Array.isArray(body.tests) ? body.tests : undefined,
      remarks: body.remarks,
    });
  }

  @Roles('doctor', 'frontdesk')
  @Delete('assignments/:assignmentId')
  deleteLabAssignment(@Param('assignmentId') assignmentId: string) {
    return this.labTestsService.deleteLabAssignment(assignmentId);
  }
}
