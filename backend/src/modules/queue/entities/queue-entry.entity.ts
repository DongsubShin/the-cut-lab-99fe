import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ClientEntity } from '../../client/entities/client.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queue_entries')
export class QueueEntryEntity extends BaseEntity {
  @Index()
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientEntity, (client) => client.queueEntries)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Index()
  @Column({ name: 'barber_id', nullable: true })
  barberId?: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.queueEntries)
  @JoinColumn({ name: 'barber_id' })
  barber?: BarberEntity;

  @Column({ type: 'int' })
  position: number;

  @Index()
  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ name: 'estimated_wait_minutes', default: 0 })
  estimatedWaitMinutes: number;
}