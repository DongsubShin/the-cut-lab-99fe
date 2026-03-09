import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntryEntity, QueueStatus } from './entities/queue-entry.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntryEntity)
    private readonly queueRepo: Repository<QueueEntryEntity>,
  ) {}

  async joinQueue(clientId: string, barberId?: string) {
    const currentCount = await this.queueRepo.count({
      where: { status: QueueStatus.WAITING },
    });

    const entry = this.queueRepo.create({
      clientId,
      barberId,
      position: currentCount + 1,
      estimatedWaitMinutes: (currentCount + 1) * 20, // Simple heuristic
      status: QueueStatus.WAITING,
    });

    return this.queueRepo.save(entry);
  }

  async getActiveQueue() {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING },
      order: { position: 'ASC' },
      relations: ['client', 'barber'],
    });
  }
}