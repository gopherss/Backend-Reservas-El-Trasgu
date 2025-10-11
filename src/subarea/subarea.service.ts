import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubareaService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createSubareaDto: CreateSubareaDto) {
    return this.prismaService.subarea.create({ data: createSubareaDto });
  }

  async findAll() {
    return this.prismaService.subarea.findMany();
  }

  async findOne(id: number) {
    const subareaExist = this.prismaService.subarea.findFirst({ where: { id } });
    if (!subareaExist) throw new NotFoundException('El sub Area no fué encontrado');
    return subareaExist;
  }

  async update(id: number, updateSubareaDto: UpdateSubareaDto) {
    await this.findOne(id);
    return this.prismaService.subarea.update({ where: { id }, data: updateSubareaDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.subarea.delete({ where: { id } });
  }
}
