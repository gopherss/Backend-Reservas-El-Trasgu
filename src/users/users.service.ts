import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateUserDto, ResetPasswordDto, SetRoleDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<Omit<CreateUserDto, 'password'>> {
    const exists = await this.prismaService.user.findUnique({ where: { email: createUserDto.email } });
    if (exists) throw new BadRequestException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role ?? 'USER',
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: {
        id: true, email: true, role: true, status: true, updatedAt: true
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, status: true, updatedAt: true }
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    await this.findOne(id);
    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.prismaService.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
    });
  }

  async remove(id: number) {
    await this.prismaService.user.delete({ where: { id } });
    return { success: true };
  }

  async blockUser(id: number, block = true) {
    await this.findOne(id);
    const user = await this.prismaService.user.update({
      where: { id },
      data: { status: !block ? true : false }
    });
    return { success: true, status: user.status };
  }

  async setRole(id: number, setRoleDto: SetRoleDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { role: setRoleDto.role }
    });
    return { id: user.id, role: user.role };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Generar contraseña temporal
    const temp = this.generateTemporaryPassword();
    const hash = await bcrypt.hash(temp, 10);

    await this.prismaService.user.update({
      where: { id: resetPasswordDto.userId },
      data: { password: hash }
    });

    // En producción: enviar por email. Aquí la devolvemos (o retornar ok y enviar email).
    return { temporaryPassword: temp };
  }

  private generateTemporaryPassword(len: number = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

}
