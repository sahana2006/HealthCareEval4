import { Controller, Get } from '@nestjs/common';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  listMedicines() {
    return this.medicinesService.findAll();
  }
}
