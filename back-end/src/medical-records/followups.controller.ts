import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { MedicalRecordsService } from './medical-records.service';

@Controller('followups')
export class FollowUpsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Roles('frontdesk')
  @Get()
  getFollowUps() {
    return this.medicalRecordsService.getFollowUps();
  }
}
