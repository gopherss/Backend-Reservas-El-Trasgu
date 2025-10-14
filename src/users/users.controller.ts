import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserDto, SetRoleDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';


@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ type: [UserResponseDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por id' })
  @ApiResponse({ type: UserResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloquear/desbloquear usuario' })
  block(@Param('id', ParseIntPipe) id: number, @Body('block') block: boolean) {
    return this.usersService.blockUser(id, block);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Cambiar rol de usuario' })
  setRole(@Param('id', ParseIntPipe) id: number, @Body() setRoleDto: SetRoleDto) {
    return this.usersService.setRole(id, setRoleDto);
  }

  @Post(':id/reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña (genera temporal)' })
  resetPassword(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.resetPassword({ userId: id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
