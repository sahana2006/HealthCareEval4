import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import {
  CreateQueueInput,
  QueueService,
  QueueStatus,
  UpdateQueueInput,
} from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Roles('frontdesk', 'doctor')
  @Post()
  createQueueToken(@Body() body: Partial<CreateQueueInput>) {
    return this.queueService.createQueueToken({
      doctorId: body.doctorId?.trim() ?? '',
      userId: body.userId?.trim() ?? '',
    });
  }

  @Roles('frontdesk')
  @Get()
  getAllQueueItems() {
    return this.queueService.getAllQueueItems();
  }

  @Roles('patient', 'frontdesk')
  @Get('user/:userId')
  getQueueByUserId(@Param('userId') userId: string) {
    return this.queueService.getQueueByUserId(userId);
  }

  @Roles('patient', 'doctor', 'frontdesk')
  @Get(':doctorId')
  getQueueByDoctorId(@Param('doctorId') doctorId: string) {
    return this.queueService.getQueueByDoctorId(doctorId);
  }

  @Roles('doctor', 'frontdesk')
  @Put(':id')
  updateQueueStatus(
    @Param('id') id: string,
    @Body() body: Partial<UpdateQueueInput>,
  ) {
    return this.queueService.updateQueueStatus(id, {
      status: (body.status as QueueStatus) ?? 'waiting',
    });
  }
}
