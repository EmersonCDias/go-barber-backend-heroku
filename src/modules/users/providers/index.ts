import { container } from 'tsyringe';

import BCriptyHashProvider from './HashProvider/implementations/BCriptyHashProvider';
import IHashProvider from './HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCriptyHashProvider);
