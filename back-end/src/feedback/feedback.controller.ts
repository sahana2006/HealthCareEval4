import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateFeedbackInput, FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Roles('patient')
  @Post()
  createFeedback(@Body() body: Partial<CreateFeedbackInput>) {
    return this.feedbackService.createFeedback({
      userId: body.userId?.trim() ?? '',
      doctorId: body.doctorId?.trim() ?? '',
      rating: body.rating?.trim() ?? '',
      comment: body.comment?.trim() ?? '',
    });
  }

  @Roles('patient', 'doctor', 'frontdesk', 'admin')
  @Get('user/:userId')
  getFeedbackByUserId(@Param('userId') userId: string) {
    return this.feedbackService.getFeedbackByUserId(userId);
  }

  @Roles('doctor', 'patient', 'frontdesk', 'admin')
  @Get(':doctorId')
  getFeedbackByDoctorId(@Param('doctorId') doctorId: string) {
    return this.feedbackService.getFeedbackByDoctorId(doctorId);
  }
}
