import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SubareaService } from './subarea.service';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Subáreas')
@Controller('subarea')
export class SubareaController {
  constructor(private readonly subareaService: SubareaService) { }

  @ApiOperation({ summary: 'Crear una nueva subárea' })
  @ApiBody({ type: CreateSubareaDto })
  @ApiResponse({ status: 201, description: 'Subárea creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  create(@Body() createSubareaDto: CreateSubareaDto) {
    return this.subareaService.create(createSubareaDto);
  }

  @ApiOperation({ summary: 'Listar todas las subáreas' })
  @ApiResponse({ status: 200, description: 'Lista de subáreas obtenida correctamente', type: [CreateSubareaDto] })
  @Get()
  findAll() {
    return this.subareaService.findAll();
  }

  @ApiOperation({ summary: 'Actualizar una subárea existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la subárea a actualizar' })
  @ApiBody({ type: UpdateSubareaDto })
  @ApiResponse({ status: 200, description: 'Subárea actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Subárea no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subareaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar una subárea existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la subárea a actualizar' })
  @ApiBody({ type: UpdateSubareaDto })
  @ApiResponse({ status: 200, description: 'Subárea actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Subárea no encontrada' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubareaDto: UpdateSubareaDto) {
    return this.subareaService.update(+id, updateSubareaDto);
  }

  @ApiOperation({ summary: 'Eliminar una subárea' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la subárea a eliminar' })
  @ApiResponse({ status: 200, description: 'Subárea eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Subárea no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subareaService.remove(+id);
  }
}
