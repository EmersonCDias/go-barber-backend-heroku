import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '../../../services/UpdateProfileService';
import ShowProfileService from '../../../services/ShowProfileService';

export default class UsersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showUserProfile = await container.resolve(ShowProfileService);

    const user = await showUserProfile.run(user_id);

    return res.status(200).json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, password, old_password } = req.body;

    const updateUser = await container.resolve(UpdateProfileService);

    const user = await updateUser.run({
      user_id,
      email,
      name,
      old_password,
      password,
    });

    return res.status(200).json(classToClass(user));
  }
}
