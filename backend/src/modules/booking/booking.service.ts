import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceEntity } from '../service/entities/service.entity';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    private readonly commissionService: CommissionService,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingEntity> {
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) throw new NotFoundException('Service not found');

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    const booking = this.bookingRepo.create({
      ...dto,
      endTime,
      totalPrice: service.price,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({ 
      where: { id },
      relations: ['barber'] 
    });
    if (!booking) throw new NotFoundException('Booking not found');

    booking.status = status;
    const updated = await this.bookingRepo.save(booking);

    if (status === BookingStatus.COMPLETED) {
      await this.commissionService.calculateForBooking(updated);
    }

    return updated;
  }

  async findAll() {
    return this.bookingRepo.find({ relations: ['barber', 'client', 'service'] });
  }
}