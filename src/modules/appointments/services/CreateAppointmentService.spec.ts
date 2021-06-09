import AppErrors from '../../../shared/errors/AppErrors';
import NotificationsRepositoryMOCK from '../../notifications/repositories/mock/NotificationRepositoryMOCK';
import CacheProviderMOCK from '../../../shared/container/providers/CacheProvider/mocks/CacheProviderMOCK';

import AppointmentsRepositoryMOCK from '../repositories/mocks/AppointmentsRepositoryMOCK';
import CreateAppointmentService from './CreateAppointmentService';

let cacheProviderMOCK: CacheProviderMOCK;
let notificationsRepositoryMOCK: NotificationsRepositoryMOCK;
let appointmentsRepositoryMOCK: AppointmentsRepositoryMOCK;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    cacheProviderMOCK = new CacheProviderMOCK();
    notificationsRepositoryMOCK = new NotificationsRepositoryMOCK();
    appointmentsRepositoryMOCK = new AppointmentsRepositoryMOCK();
    createAppointmentService = new CreateAppointmentService(
      appointmentsRepositoryMOCK,
      notificationsRepositoryMOCK,
      cacheProviderMOCK,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Simular que quando o método Date.now() for chamado, eu quero retornar um novo valor pra ele
    // É como se estivesse rescrevendo a implementação da função
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.run({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user1',
      provider_id: 'user2',
    });

    expect(appointment).toHaveProperty('id');
    expect(JSON.stringify(appointment.date)).toBe(
      JSON.stringify(new Date(2020, 4, 10, 13)),
    );
    expect(appointment.user_id).toBe('user1');
    expect(appointment.provider_id).toBe('user2');
  });

  it('should not be able to create two or more appointments on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 13);

    await createAppointmentService.run({
      date,
      user_id: 'user_id',
      provider_id: 'provider_id',
    });

    await expect(
      createAppointmentService.run({
        date,
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.run({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.run({
        date: new Date(2020, 4, 10, 13),
        user_id: 'user1',
        provider_id: 'user1',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to make an appointment before 8h and after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(
      createAppointmentService.run({
        date: new Date(2020, 4, 10, 7),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppErrors);

    await expect(
      createAppointmentService.run({
        date: new Date(2020, 4, 10, 18),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
