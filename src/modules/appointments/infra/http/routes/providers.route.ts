import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '../controllers/ProvidersController';
import ListProviderDayAvailabilityService from '../controllers/ProviderDayAvailabilityController';
import ListProviderMonthAvailabilityService from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const listProviderDayAvailabilityService = new ListProviderDayAvailabilityService();
const listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  listProviderDayAvailabilityService.index,
);
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  listProviderMonthAvailabilityService.index,
);

export default providersRouter;
