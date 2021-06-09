import AppErrors from '../../../shared/errors/AppErrors';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import UserTokensRepositoryMOCK from '../repositories/mocks/UserTokensRepositoryMOCK';
import ResetPasswordService from './ResetPasswordService';
import HashProviderMOCK from '../providers/HashProvider/mocks/HashProviderMOCK';

let usersRepositoryMOCK: UsersRepositoryMOCK;
let userTokensRepositoryMOCK: UserTokensRepositoryMOCK;
let hashProviderMOCK: HashProviderMOCK;
let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    userTokensRepositoryMOCK = new UserTokensRepositoryMOCK();
    hashProviderMOCK = new HashProviderMOCK();

    resetPasswordService = new ResetPasswordService(
      usersRepositoryMOCK,
      userTokensRepositoryMOCK,
      hashProviderMOCK,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123mudar',
    });

    const { token } = await userTokensRepositoryMOCK.generate(user.id);

    const generateHash = jest.spyOn(hashProviderMOCK, 'generateHash');

    const updatedUser = await usersRepositoryMOCK.findUserById(user.id);

    await resetPasswordService.run({
      password: '1234mudar',
      token,
    });

    expect(generateHash).toHaveBeenCalledWith('1234mudar');
    expect(updatedUser?.password).toBe('1234mudar');
  });

  it('should not be able to reset the password without a token', async () => {
    await expect(
      resetPasswordService.run({
        password: '1234mudar',
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to reset the password without a valid user ', async () => {
    const { token } = await userTokensRepositoryMOCK.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.run({
        password: '123mudar',
        token,
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to reset the password if token is expired (2h)', async () => {
    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123mudar',
    });

    const { token } = await userTokensRepositoryMOCK.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.run({
        password: '123mudar',
        token,
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
