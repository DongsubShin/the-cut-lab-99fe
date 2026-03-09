import { Entity, Column, Index, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';

@Entity('commissions')
export class CommissionEntity extends BaseEntity {
  @Index()
  @Column({ name: 'barber_id' })
  barberId: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.commissions)
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @Index({ unique: true })
  @Column({ name: 'booking_id', unique: true })
  bookingId: string;

  @OneToOne(() => BookingEntity, (booking) => booking.commission)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'applied_rate' })
  appliedRate: number;

  @Index()
  @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
  paidAt?: Date;
}