import { injectable, inject } from 'tsyringe';

import AppErrors from '../../../shared/errors/AppErrors';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async run({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) throw new AppErrors('User not found');

    const userEmailExists = await this.usersRepository.findUserByEmail(email);

    if (userEmailExists && userEmailExists.id !== user_id) {
      throw new AppErrors('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password)
      throw new AppErrors('Old password not informed');

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) throw new AppErrors('Old password does not match');

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.saveUser(user);

    return user;
  }
}
