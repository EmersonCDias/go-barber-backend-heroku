import { injectable, inject } from 'tsyringe';

import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import AppErrors from '../../../shared/errors/AppErrors';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async run({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findUserByEmail(email);

    if (checkUserExists) throw new AppErrors('E-mail address already exists');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.createAndSaveUser({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
