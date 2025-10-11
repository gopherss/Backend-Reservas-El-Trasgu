import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createClientDto: CreateClientDto) {
    const clientExists = await this.findByEmail(createClientDto.correo);

    if (clientExists) return clientExists;

    return await this.prismaService.client.create({ data: createClientDto })
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

  private async findByEmail(correo: string) {
    return this.prismaService.client.findUnique({ where: { correo } });
  }

}
