import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column({ name: 'full_name' })
  fullName: string;

  @Index({ unique: true })
  @Column({ unique: true })
  phone: string;

  @Index()
  @Column({ nullable: true })
  email: string;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => BookingEntity, (booking) => booking.client)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.client)
  queueEntries: QueueEntryEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.client)
  notifications: NotificationEntity[];
}