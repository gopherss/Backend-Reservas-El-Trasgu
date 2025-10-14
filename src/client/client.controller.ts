import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto, RegisterClientDto, UpdateClientDto } from './dto';

@ApiTags('Clients')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o duplicados' })
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiBody({ type: RegisterClientDto })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o duplicados' })
  @Post("register")
  createRegistered(@Body() registerClientDto: RegisterClientDto) {
    return this.clientService.registerClient(registerClientDto);
  }

  @ApiOperation({ summary: 'Actualizar cliente invitado a registrado' })
  @ApiBody({ type: RegisterClientDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado a registrado' })
  @Post('upgrade')
  upgradeClient(@Body() dto: RegisterClientDto) {
    return this.clientService.upgradeClientToRegistered(dto);
  }

  @Get(':search')
  @ApiOperation({ summary: 'buscar empleado por, nombre | apellido' })
  findByEmployee(@Param('search') search: string) {
    return this.clientService.findByClient(search);
  }

  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida correctamente', type: [CreateClientDto] })
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar los datos de un cliente existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del cliente a actualizar' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @ApiOperation({ summary: 'Eliminar un cliente (soft delete o real según implementación)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del cliente a eliminar' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.remove(+id);
  }
}
