import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto, RegisterClientDto, UpdateClientDto } from './dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ClientService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createClientDto: CreateClientDto) {
    if (createClientDto.tipoCliente !== 'INVITADO') {
      throw new BadRequestException('Solo se puede crear clientes invitados desde este método')
    }

    const clientExists = await this.prismaService.client.findUnique({ where: { correo: createClientDto.correo } });
    if (clientExists) return clientExists;
    return await this.prismaService.client.create({ data: createClientDto })
  }

  async registerClient(registerClientDto: RegisterClientDto) {
    const { password, correo, ...clientData } = registerClientDto;

    const existingClient = await this.prismaService.client.findUnique({ where: { correo } });
    const existingUser = await this.prismaService.user.findUnique({ where: { user: correo } });

    if (existingClient || existingUser)
      throw new BadRequestException('Ya existe un cliente o usuario con ese correo.');

    const hashed = await bcrypt.hash(password, 10);

    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          user: correo,
          password: hashed,
          role: 'USER',
        },
      });

      const client = await tx.client.create({
        data: {
          ...clientData,
          correo,
          tipoCliente: 'REGISTRADO',
          userId: user.id,
        },
      });

      return { user, client };
    });
  }

  async upgradeClientToRegistered(registerClientDto: RegisterClientDto) {
    const { password, correo } = registerClientDto;

    const client = await this.prismaService.client.findUnique({ where: { correo } });
    if (!client) throw new NotFoundException('Cliente no encontrado.');

    if (client.tipoCliente === 'REGISTRADO')
      throw new BadRequestException('El cliente ya está registrado.');

    const existingUser = await this.prismaService.user.findUnique({ where: { user: correo } });
    if (existingUser)
      throw new BadRequestException('Ya existe un usuario con este correo.');

    const hashed = await bcrypt.hash(password, 10);

    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          user: correo,
          password: hashed,
          role: 'USER',
        },
      });

      const updatedClient = await tx.client.update({
        where: { id: client.id },
        data: {
          tipoCliente: 'REGISTRADO',
          userId: user.id,
        },
      });

      return { user, client: updatedClient };
    });
  }

  async findByClient(search: string) {
    const employees = await this.prismaService.client.findMany({
      where: {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { apellido: { contains: search, mode: 'insensitive' } },
        ]
      }
    });
    if (employees.length === 0) throw new BadRequestException('No se encontraron clientes con ese criterio');
    return employees;
  }

  async findAll() {
    return await this.prismaService.client.findMany();
  }

  async findOne(id: number) {
    const clientExists = await this.prismaService.client.findFirst({ where: { id } });
    if (!clientExists) throw new NotFoundException('Cliente no encontrado');
    return clientExists;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.findOne(id);
    return await this.prismaService.client.update({ where: { id }, data: { ...updateClientDto } })
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.client.delete({ where: { id } });
  }

}
