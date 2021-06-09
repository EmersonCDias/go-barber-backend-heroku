import { v4 as uuidv4 } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '../IAppointmentsRepository';
import ICreateAppointmentDTO from '../../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../../dtos/IFindAllInDayFromProviderDTO';
import IFindByDateDTO from '../../dtos/IFindByDateDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepositoryMOCK implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async createAndSave({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuidv4(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      item =>
        item.provider_id === provider_id &&
        getDate(item.date) === day &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year,
    );

    return appointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      item =>
        item.provider_id === provider_id &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year,
    );

    return appointments;
  }

  public async findByDate({
    date,
    provider_id,
  }: IFindByDateDTO): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }
}

export default AppointmentsRepositoryMOCK;
