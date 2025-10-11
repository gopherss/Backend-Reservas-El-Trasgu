import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EmployeeModule } from './employee/employee.module';
import { ClientModule } from './client/client.module';
import { ReservationModule } from './reservation/reservation.module';
import { AreaModule } from './area/area.module';
import { SubareaModule } from './subarea/subarea.module';

@Module({
  imports: [
    AuthModule, PrismaModule, UsersModule, EmployeeModule, ClientModule, ReservationModule, AreaModule, SubareaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
