import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { LeaveRequestsService } from './leave-requests.service';

@ApiTags('Leave Requests')
@ApiHeader({
  name: 'role',
  description: 'User role for RBAC',
  required: true,
})
@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @ApiOperation({ summary: 'Create a new leave request (Doctor)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['doctorId', 'date'],
      properties: {
        doctorId: { type: 'string', example: 'DOC001' },
        date: { type: 'string', example: '2026-05-10', description: 'ISO date' },
        type: { type: 'string', example: 'Casual', description: 'Type of leave' },
        reason: { type: 'string', example: 'Personal', description: 'Optional reason' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Leave request created' })
  @Roles('doctor')
  @Post()
  createLeaveRequest(@Body() body: { doctorId: string; date: string; type?: string; reason?: string }) {
    return this.leaveRequestsService.createLeaveRequest(
      body.doctorId,
      body.date,
      body.type,
      body.reason,
    );
  }

  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, description: 'List of all leave requests' })
  @Roles('admin', 'doctor', 'frontdesk')
  @Get()
  getLeaveRequests() {
    return this.leaveRequestsService.getAllRequests();
  }

  @ApiOperation({ summary: 'Update leave request status (Admin)' })
  @ApiParam({ name: 'id', description: 'Leave Request ID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: ['approved', 'rejected'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @Roles('admin')
  @Put(':id')
  updateRequestStatus(
    @Param('id') id: string,
    @Body() body: { status: 'approved' | 'rejected' },
  ) {
    return this.leaveRequestsService.updateRequestStatus(id, body.status);
  }
}
