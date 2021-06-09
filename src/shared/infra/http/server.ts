import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction, response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '../../../config/upload';
import AppErrors from '../../errors/AppErrors';

import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '../typeorm';
import '../../container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppErrors) {
    return res.status(err.statusCode).json({
      status: 'error',
      msg: err.msg,
    });
  }

  console.log('req', req);
  console.log('res', res);

  return response.status(500).json({
    status: 'error',
    msg: 'Internal server error 1',
  });
});

app.listen(process.env.PORT || 3333);
