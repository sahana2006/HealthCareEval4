import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicinesModule } from './medicines/medicines.module';
import { OrdersModule } from './orders/orders.module';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, PatientsModule, MedicinesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
