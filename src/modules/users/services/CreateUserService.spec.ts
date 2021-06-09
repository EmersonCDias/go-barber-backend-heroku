import AppErrors from '../../../shared/errors/AppErrors';
import CacheProviderMOCK from '../../../shared/container/providers/CacheProvider/mocks/CacheProviderMOCK';

import UsersRepositoryMOCK from '../repositories/mocks/UsersRepositoryMOCK';
import HashProviderMOCK from '../providers/HashProvider/mocks/HashProviderMOCK';
import CreateUserService from './CreateUserService';

let cacheProviderMOCK: CacheProviderMOCK;
let usersRepositoryMOCK: UsersRepositoryMOCK;
let hashProviderMOCK: HashProviderMOCK;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    cacheProviderMOCK = new CacheProviderMOCK();
    usersRepositoryMOCK = new UsersRepositoryMOCK();
    hashProviderMOCK = new HashProviderMOCK();
    createUserService = new CreateUserService(
      usersRepositoryMOCK,
      hashProviderMOCK,
      cacheProviderMOCK,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.run({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@email.com');
    expect(user).toHaveProperty('password');
  });

  it('should not be able to create a new user if it already exists', async () => {
    await createUserService.run({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123mudar',
    });

    await expect(
      createUserService.run({
        name: 'John Doe 1',
        email: 'johndoe@email.com',
        password: '123mudar',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
