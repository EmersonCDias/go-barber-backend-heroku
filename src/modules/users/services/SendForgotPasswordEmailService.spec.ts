import AppErrors from '../../../shared/errors/AppErrors';
import MailProviderMOCK from '../../../shared/container/providers/MailProvider/mocks/MailProviderMOCK';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import UserTokensRepositoryMOCK from '../repositories/mocks/UserTokensRepositoryMOCK';

let usersRepositoryMOCK: UsersRepositoryMOCK;
let mailProviderMOCK: MailProviderMOCK;
let userTokensRepositoryMOCK: UserTokensRepositoryMOCK;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    mailProviderMOCK = new MailProviderMOCK();
    userTokensRepositoryMOCK = new UserTokensRepositoryMOCK();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      usersRepositoryMOCK,
      mailProviderMOCK,
      userTokensRepositoryMOCK,
    );
  });

  it('should be able to recover the password by sending e-mail', async () => {
    const sendMail = jest.spyOn(mailProviderMOCK, 'sendMail');

    await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123mudar',
    });

    await sendForgotPasswordEmailService.run({
      email: 'johndoe@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password if there is no user', async () => {
    await expect(
      sendForgotPasswordEmailService.run({
        email: 'johndoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(userTokensRepositoryMOCK, 'generate');

    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123mudar',
    });

    await sendForgotPasswordEmailService.run({
      email: 'johndoe@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
