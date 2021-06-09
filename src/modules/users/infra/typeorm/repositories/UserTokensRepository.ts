import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '../../../repositories/IUserTokensRepository';

import UserTokens from '../entities/UserTokens';

export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokens>;

  constructor() {
    this.ormRepository = getRepository(UserTokens);
  }

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findUserByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}
