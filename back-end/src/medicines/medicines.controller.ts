import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Roles('patient', 'doctor', 'frontdesk')
  @Get()
  listMedicines() {
    return this.medicinesService.findAll();
  }
}
