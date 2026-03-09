import { Entity, Column, Index, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';
import { CommissionEntity } from '../../commission/entities/commission.entity';

@Entity('barbers')
export class BarberEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.barberProfile)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('text', { array: true, default: '{}' })
  specialties: string[];

  @Column({ type: 'jsonb', name: 'working_hours', nullable: true })
  workingHours: any;

  @Index()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'default_commission_rate', default: 0.60 })
  defaultCommissionRate: number;

  @ManyToMany(() => ServiceEntity, (service) => service.barbers)
  @JoinTable({
    name: 'barber_services',
    joinColumn: { name: 'barber_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: ServiceEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.barber)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.barber)
  queueEntries: QueueEntryEntity[];

  @OneToMany(() => CommissionEntity, (commission) => commission.barber)
  commissions: CommissionEntity[];
}