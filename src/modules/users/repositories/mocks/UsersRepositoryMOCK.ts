import { v4 as uuidv4 } from 'uuid';

import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

export default class UsersRepositoryMOCK implements IUsersRepository {
  private users: User[] = [];

  public async createAndSaveUser(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuidv4() }, userData);

    this.users.push(user);

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(item => item.id !== except_user_id);
    }

    return users;
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    const findEmail = this.users.find(item => item.email === email);

    return findEmail;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    const findId = this.users.find(item => item.id === id);

    return findId;
  }

  public async saveUser(user: User): Promise<User> {
    const findIndex = this.users.findIndex(item => item.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}
