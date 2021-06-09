import AppointmentsRepositoryMOCK from '../repositories/mocks/AppointmentsRepositoryMOCK';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let appointmentsRepositoryMOCK: AppointmentsRepositoryMOCK;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    appointmentsRepositoryMOCK = new AppointmentsRepositoryMOCK();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      appointmentsRepositoryMOCK,
    );
  });

  it('should be able to list the available dates by month from provider', async () => {
    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await appointmentsRepositoryMOCK.createAndSave({
      provider_id: 'user',
      user_id: 'user1',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.run({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
