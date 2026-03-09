import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { BookingEntity } from '../booking/entities/booking.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionEntity)
    private readonly commissionRepo: Repository<CommissionEntity>,
  ) {}

  async calculateForBooking(booking: BookingEntity) {
    const rate = booking.barber.defaultCommissionRate || 0.60;
    const amount = Number(booking.totalPrice) * Number(rate);

    const commission = this.commissionRepo.create({
      barberId: booking.barberId,
      bookingId: booking.id,
      amount,
      appliedRate: rate,
    });

    return this.commissionRepo.save(commission);
  }
}