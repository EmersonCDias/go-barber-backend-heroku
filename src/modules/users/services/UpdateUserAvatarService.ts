import { injectable, inject } from 'tsyringe';

import AppErrors from '../../../shared/errors/AppErrors';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async run({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) {
      throw new AppErrors('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.saveUser(user);

    return user;
  }
}

export default UpdateUserAvatarService;
