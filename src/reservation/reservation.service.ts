import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
// import { nanoid } from 'nanoid';

@Injectable()
export class ReservationService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService,
  ) { }

  async create(createReservationDto: CreateReservationDto) {

    const reservaDisponible = await this.validarDisponibilidad(
      new Date(createReservationDto.fechaReserva),
      new Date(createReservationDto.horaReserva),
      createReservationDto.subareaId,
    );

    if (!reservaDisponible) throw new BadRequestException('Subárea no disponible en ese horario.');

    // const codigoQR = `RES-${nanoid(8)}`;

    const reserva = await this.prismaService.reservation.create({
      data:{
        ...createReservationDto,
        // codigoQR
      },
      include:{
        client: true,
        area: true,
        subarea: true,
      }
    })

    //integración del envío de correo y/o WhatsApp
    
    return reserva;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reservas, total] = await Promise.all([
      this.prismaService.reservation.findMany({
        skip,
        take: limit,
        orderBy: { fechaReserva: 'desc' }
      }),
      this.prismaService.reservation.count(),
    ]);

    return {
      data: reservas,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      }
    }
  }

  async findOne(id: number) {
    const reservationExists = await this.prismaService.reservation.findFirst({ where: { id } });
    if (!reservationExists) throw new NotFoundException('Reservación no encontrada');
    return reservationExists;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    await this.findOne(id);
    return await this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto
    })
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.reservation.delete({ where: { id } })
  }

  async cancelarReserva(id: number, motivo: string, esCliente: boolean = false) {
    const reserva = await this.prismaService.reservation.findUnique({ where: { id } });
    if (!reserva) throw new BadRequestException('Reserva no encontrada.');

    return this.prismaService.reservation.update({
      where: {id},
      data: {
        estado: 'CANCELADA',
        motivoCancelacion: esCliente ? 'Cacelada por el cliente' : motivo,
      }
    })
  }

  async confirmarManual(id: number, hostId: number) {
    return this.prismaService.reservation.update({
      where: { id },
      data: {
        estado: 'CONFIRMADA',
        fechaConfirmacion: new Date(),
        hostId,
      }
    })
  }
  
  private async validarDisponibilidad(fechaReserva: Date, horaReserva: Date, subareaId: number){
    const reservaExiste = await this.prismaService.reservation.findFirst({
      where:{
        fechaReserva,
        horaReserva,
        subareaId,
        estado: {in: ['PENDIENTE','CONFIRMADA']}
      }
    })

    return !reservaExiste;
  }

}
