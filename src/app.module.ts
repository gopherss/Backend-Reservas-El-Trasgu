import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    AuthModule, PrismaModule, UsersModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
