import AppErrors from '../../../shared/errors/AppErrors';
import StorageProviderMOCK from '../../../shared/container/providers/StorageProvider/mocks/StorageProviderMOCK';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let usersRepositoryMOCK: UsersRepositoryMOCK;
let storageProviderMOCK: StorageProviderMOCK;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    storageProviderMOCK = new StorageProviderMOCK();
    updateUserAvatar = new UpdateUserAvatarService(
      usersRepositoryMOCK,
      storageProviderMOCK,
    );
  });

  it('should be able to upload an image', async () => {
    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar if there is no user', async () => {
    await expect(
      updateUserAvatar.run({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should be able to delete an image if user already has one', async () => {
    const deleteFile = jest.spyOn(storageProviderMOCK, 'deleteFile');

    const user = await usersRepositoryMOCK.createAndSaveUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFileName: 'avatar1.jpg',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar1.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
