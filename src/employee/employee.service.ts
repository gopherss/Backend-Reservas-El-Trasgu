import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

   async create(createEmployeeDto: Readonly<CreateEmployeeDto>) {
    const { correo, dni, password, cargo, ...rest } = createEmployeeDto;
    await this.validateEmployee(correo, dni);

    // Crear usuario y empleado en transacción
    const result = await this.prismaService.$transaction(async (tx) => {
      const role = this.mapCargoToRole(cargo);

      const hash = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          user: correo,
          password: hash,
          role,
        },
      });

      const employee = await tx.employee.create({
        data: {
          ...rest,
          correo,
          dni,
          cargo,
          telefono: createEmployeeDto.telefono,
          userId: user.id,
        },
      });

      return {
        message: 'Empleado y usuario creados correctamente',
        employee,
        user: {
          id: user.id,
          user: user.user,
          role: user.role,
        },
      };
    });

    return result;
  }

  async findAll() {
    return await this.prismaService.employee.findMany({
      select: { nombre: true, apellido: true, dni: true, telefono: true, correo: true, cargo: true, estado: true, userId: true, createdAt: true }
    });
  }

  async findByEmployee(search: string) {
    const employees = await this.prismaService.employee.findMany({
      where: {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { apellido: { contains: search, mode: 'insensitive' } },
          { dni: { contains: search, mode: 'insensitive' } },
          { correo: { contains: search, mode: 'insensitive' } }
        ]
      }
    });
    if (employees.length === 0) throw new BadRequestException('No se encontraron empleados con ese criterio');
    return employees;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findById(id)
    await this.validateEmployee(updateEmployeeDto.correo!, updateEmployeeDto.dni!)
    return await this.prismaService.employee.update({ where: { id }, data: updateEmployeeDto });;
  }

  async remove(id: number) {
    await this.findById(id);
    return await this.prismaService.employee.delete({ where: { id } });
  }

  
  private mapCargoToRole(cargo: string): Role {
    switch (cargo) {
      case 'ADMINISTRADOR':
        return Role.ADMIN;
      case 'PORTERO':
        return Role.PORTRESS;
      default:
        return Role.USER;
    }
  }

   private async validateEmployee(correo: string, dni: string) {
    const [emailExists, dniExists, userExists] = await Promise.all([
      this.prismaService.employee.findUnique({ where: { correo } }),
      this.prismaService.employee.findUnique({ where: { dni } }),
      this.prismaService.user.findUnique({ where: { user: correo } }),
    ]);

    if (emailExists) throw new BadRequestException('El correo ya está registrado como empleado.');
    if (dniExists) throw new BadRequestException('El DNI ya está registrado.');
    if (userExists) throw new BadRequestException('Ya existe un usuario con este correo.');
  }

  private async findById(id: number) {
    const employeeExists = await this.prismaService.employee.findUnique({ where: { id } });
    if (!employeeExists) throw new NotFoundException('Empleado no encontrado.');
  }
}
