import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '../../../repositories/INotificationsRepository';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = await this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}
