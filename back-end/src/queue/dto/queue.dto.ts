import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQueueDto {
  @ApiProperty({ example: 'DOC001' })
  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @ApiProperty({ example: 'PAT001' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class UpdateQueueDto {
  @ApiProperty({ example: 'waiting', enum: ['waiting', 'in-progress', 'done'] })
  @IsString()
  @IsIn(['waiting', 'in-progress', 'done'])
  @IsNotEmpty()
  status!: 'waiting' | 'in-progress' | 'done';
}
