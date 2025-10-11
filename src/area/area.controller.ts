import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Áreas')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) { }

  @ApiOperation({ summary: 'Crear una nueva área' })
  @ApiBody({ type: CreateAreaDto })
  @ApiResponse({ status: 201, description: 'Área creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @ApiOperation({ summary: 'Listar todas las áreas' })
  @ApiResponse({ status: 200, description: 'Lista de áreas obtenida correctamente', type: [CreateAreaDto] })
  @Get()
  findAll() {
    return this.areaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una área por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del área' })
  @ApiResponse({ status: 200, description: 'Área encontrada' })
  @ApiResponse({ status: 404, description: 'Área no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un área existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del área a actualizar' })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({ status: 200, description: 'Área actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Área no encontrada' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(+id, updateAreaDto);
  }

  @ApiOperation({ summary: 'Eliminar un área' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del área a eliminar' })
  @ApiResponse({ status: 200, description: 'Área eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Área no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.remove(+id);
  }
}
