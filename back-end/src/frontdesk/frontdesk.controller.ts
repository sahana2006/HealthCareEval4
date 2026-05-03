import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { FrontdeskService } from './frontdesk.service';
import type {
  CreateFrontdeskInput,
  UpdateFrontdeskInput,
} from './frontdesk.service';

@ApiTags('Frontdesk')
@Controller('frontdesk')
export class FrontdeskController {
  constructor(private readonly frontdeskService: FrontdeskService) {}

  @ApiOperation({ summary: 'List all frontdesk staff' })
  @ApiResponse({ status: 200, description: 'Array of frontdesk profiles' })
  @Roles('admin')
  @Get()
  listFrontdesk() {
    return this.frontdeskService.findAll();
  }

  @ApiOperation({ summary: 'Get frontdesk profile by userId' })
  @ApiParam({ name: 'userId', description: 'Frontdesk user ID (e.g. FD001)' })
  @ApiResponse({ status: 200, description: 'Frontdesk profile object' })
  @ApiResponse({ status: 404, description: 'Frontdesk profile not found' })
  @Roles('admin', 'frontdesk')
  @Get(':userId')
  getFrontdesk(@Param('userId') userId: string) {
    return this.frontdeskService.getFrontdeskByUserId(userId);
  }

  @ApiOperation({ summary: 'Add frontdesk staff and create login user' })
  @ApiResponse({ status: 201, description: 'Frontdesk profile created' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate email' })
  @Roles('admin')
  @Post()
  addFrontdesk(@Body() body: CreateFrontdeskInput) {
    return this.frontdeskService.createFrontdesk({
      name: body.name?.trim() ?? '',
      email: body.email?.trim() ?? '',
      password: body.password ?? '',
      phone: body.phone?.trim(),
      gender: body.gender?.trim(),
      reportingManagerId: body.reportingManagerId?.trim(),
      languages: body.languages ?? [],
      counter: body.counter?.trim(),
      shiftStart: body.shiftStart?.trim(),
      shiftEnd: body.shiftEnd?.trim(),
    });
  }

  @ApiOperation({ summary: 'Edit frontdesk staff by userId' })
  @ApiParam({ name: 'userId', description: 'Frontdesk user ID (e.g. FD001)' })
  @ApiResponse({ status: 200, description: 'Frontdesk profile updated' })
  @ApiResponse({ status: 404, description: 'Frontdesk profile not found' })
  @Roles('admin')
  @Put(':userId')
  updateFrontdesk(
    @Param('userId') userId: string,
    @Body() body: UpdateFrontdeskInput,
  ) {
    return this.frontdeskService.updateFrontdesk(userId, {
      name: body.name?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      gender: body.gender?.trim(),
      reportingManagerId: body.reportingManagerId?.trim(),
      languages: body.languages,
      counter: body.counter?.trim(),
      shiftStart: body.shiftStart?.trim(),
      shiftEnd: body.shiftEnd?.trim(),
    });
  }
}
