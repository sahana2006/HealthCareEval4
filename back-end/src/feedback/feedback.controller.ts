import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFeedbackInput, FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  createFeedback(@Body() body: Partial<CreateFeedbackInput>) {
    return this.feedbackService.createFeedback({
      userId: body.userId?.trim() ?? '',
      doctorId: body.doctorId?.trim() ?? '',
      rating: body.rating?.trim() ?? '',
      comment: body.comment?.trim() ?? '',
    });
  }

  @Get('user/:userId')
  getFeedbackByUserId(@Param('userId') userId: string) {
    return this.feedbackService.getFeedbackByUserId(userId);
  }

  @Get(':doctorId')
  getFeedbackByDoctorId(@Param('doctorId') doctorId: string) {
    return this.feedbackService.getFeedbackByDoctorId(doctorId);
  }
}
