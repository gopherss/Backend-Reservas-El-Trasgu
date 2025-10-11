import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AreaService {

  constructor(
    private readonly prismaService : PrismaService,
  ){}

  async create(createAreaDto: CreateAreaDto) {
    return this.prismaService.area.create({ data: createAreaDto });
  }

  async findAll() {
    return await this.prismaService.area.findMany();
  }

  async findOne(id: number) {
    const areaExist = await this.prismaService.area.findFirst({ where: { id } });
    if (!areaExist) throw new NotFoundException("Area No encontrada");
    return areaExist;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    await this.findOne(id);
    return this.prismaService.area.update({ where: { id }, data: updateAreaDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.area.delete({ where: { id } });
  }
}
