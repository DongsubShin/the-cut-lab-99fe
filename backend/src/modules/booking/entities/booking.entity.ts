import { Entity, Column, Index, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { CommissionEntity } from '../../commission/entities/commission.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NOSHOW = 'no_show',
}

@Entity('bookings')
export class BookingEntity extends BaseEntity {
  @Index()
  @Column({ name: 'barber_id' })
  barberId: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.bookings)
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @Index()
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientEntity, (client) => client.bookings)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'service_id' })
  serviceId: string;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Index()
  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @OneToOne(() => CommissionEntity, (commission) => commission.booking)
  commission?: CommissionEntity;
}