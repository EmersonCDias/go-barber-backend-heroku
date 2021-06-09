import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import INotificationsRepository from '../../notifications/repositories/INotificationsRepository';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import AppErrors from '../../../shared/errors/AppErrors';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async run({
    provider_id,
    date,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (provider_id === user_id) {
      throw new AppErrors('You can not create an appointment with yourself!');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppErrors(
        'You can not create a new appointment on a past date!',
      );
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppErrors(
        'You can only make an appointment between 8h and 17h',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      {
        date: appointmentDate,
        provider_id,
      },
    );

    if (findAppointmentInSameDate) {
      throw new AppErrors('This appointment is already booked!');
    }

    const appointment = await this.appointmentsRepository.createAndSave({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatter = format(appointmentDate, "dd-MM-yyyy 'às' HH");

    await this.notificationsRepository.create({
      content: `Novo agendamento para dia ${dateFormatter}h`,
      recipient_id: provider_id,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
