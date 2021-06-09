import AppErrors from '../../../shared/errors/AppErrors';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import ShowProfileService from './ShowProfileService';

let usersRepositoryMOCK: UsersRepositoryMOCK;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    showProfileService = new ShowProfileService(usersRepositoryMOCK);
  });

  it('should be able to return the user info', async () => {
    const { id } = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    const profile = await showProfileService.run(id);

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@email.com');
  });

  it('should not be able to return the user info if it does not exist', () => {
    expect(
      showProfileService.run('nonexistent-user-id'),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
