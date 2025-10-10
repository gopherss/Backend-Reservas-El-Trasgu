import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Omit<CreateEmployeeDto, 'id'>> {
    await this.validateEmployee(createEmployeeDto.correo, createEmployeeDto.dni)
    const newEmployee = await this.prismaService.employee.create({
      data: { ...createEmployeeDto }
    })

    const { id: _, ...employeeWithouId } = newEmployee;

    return employeeWithouId;
  }

  async findAll() {
    return await this.prismaService.employee.findMany({
      select: { nombre: true, apellido: true, dni: true, telefono: true, correo: true, cargo: true, fecha_ingreso: true, estado: true, userId: true, createdAt: true }
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


  private async validateEmployee(correo: string, dni: string) {
    const emailExists = await this.prismaService.employee.findUnique({ where: { correo: correo } });
    if (emailExists) throw new BadRequestException('El email ya está registrado');

    const dniExists = await this.prismaService.employee.findUnique({ where: { dni: dni } });
    if (dniExists) throw new BadRequestException('El dni ya está regisitrado');

  }

  private async findById(id: number) {
    const employeeExists = await this.prismaService.employee.findUnique({ where: { id } });
    if (!employeeExists) throw new NotFoundException('Empleado no encontrado.');
  }
}
