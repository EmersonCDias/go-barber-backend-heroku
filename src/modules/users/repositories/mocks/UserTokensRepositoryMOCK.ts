import { v4 as uuidv4 } from 'uuid';

import IUserTokensRepository from '../IUserTokensRepository';

import UserTokens from '../../infra/typeorm/entities/UserTokens';

export default class UserTokensRepositoryMOCK implements IUserTokensRepository {
  private userTokens: UserTokens[] = [];

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      id: uuidv4(),
      token: uuidv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findUserByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = this.userTokens.find(item => item.token === token);

    return userToken;
  }
}
