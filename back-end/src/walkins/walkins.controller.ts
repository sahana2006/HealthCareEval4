import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateWalkInInput, WalkInsService } from './walkins.service';

@Controller('walkins')
export class WalkInsController {
  constructor(private readonly walkinsService: WalkInsService) {}

  @Roles('frontdesk')
  @Get()
  getAllWalkIns() {
    return this.walkinsService.getAllWalkIns();
  }

  @Roles('frontdesk')
  @Post()
  createWalkIn(@Body() body: Partial<CreateWalkInInput>) {
    return this.walkinsService.createWalkIn({
      firstName: body.firstName?.trim() ?? '',
      lastName: body.lastName?.trim() ?? '',
      email: body.email?.trim() ?? '',
      phone: body.phone?.trim() ?? '',
      dob: body.dob?.trim() ?? '',
      gender: body.gender?.trim() ?? '',
      bloodGroup: body.bloodGroup?.trim() ?? '',
      guardianName: body.guardianName?.trim() ?? '',
    });
  }
}
