import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';

const clientDist = join(process.cwd(), '..', 'client', 'build', 'client');

export const serveStaticConfig: ServeStaticModuleOptions = {
  exclude: ['/api'],
  rootPath: clientDist,
};
