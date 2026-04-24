import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTestBookingInput, LabTestsService } from './labtests.service';

@Controller('labtests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Get()
  listLabTests() {
    return this.labTestsService.findAllTests();
  }

  @Post('book')
  createBooking(@Body() body: Partial<CreateTestBookingInput>) {
    return this.labTestsService.createBooking({
      userId: body.userId?.trim() ?? '',
      labTestId: body.labTestId?.trim() ?? '',
    });
  }

  @Get('cart/:userId')
  getCartBookings(@Param('userId') userId: string) {
    return this.labTestsService.getCartBookingsByUserId(userId);
  }

  @Post('confirm/:userId')
  confirmBookings(@Param('userId') userId: string) {
    return this.labTestsService.confirmBookingsByUserId(userId);
  }

  @Get('history/:userId')
  getBookingHistory(@Param('userId') userId: string) {
    return this.labTestsService.getBookingHistoryByUserId(userId);
  }

  @Delete('cart/:bookingId')
  removeCartBooking(@Param('bookingId') bookingId: string) {
    return this.labTestsService.removeCartBooking(bookingId);
  }
}
