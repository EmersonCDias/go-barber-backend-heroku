import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import ListProvidersService from '../../../services/ListProvidersService';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listProvider = container.resolve(ListProvidersService);

    const providers = await listProvider.run({ user_id });

    return res.json(classToClass(providers));
  }
}
