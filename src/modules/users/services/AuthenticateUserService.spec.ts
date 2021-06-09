import AppErrors from '../../../shared/errors/AppErrors';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import HashProviderMOCK from '../providers/HashProvider/mocks/HashProviderMOCK';
import AuthenticateUserService from './AuthenticateUserService';

let usersRepositoryMOCK: UsersRepositoryMOCK;
let hashProviderMOCK: HashProviderMOCK;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    hashProviderMOCK = new HashProviderMOCK();
    authenticateUserService = new AuthenticateUserService(
      usersRepositoryMOCK,
      hashProviderMOCK,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    const response = await authenticateUserService.run({
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate if user does not exists', async () => {
    await expect(
      authenticateUserService.run({
        email: 'johndoe1@email.com',
        password: '123mudar',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to authenticate if password is incorrect', async () => {
    await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    await expect(
      authenticateUserService.run({
        email: 'johndoe@email.com',
        password: '123muda',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
