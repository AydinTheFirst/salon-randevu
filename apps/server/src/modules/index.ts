import { AuthModule } from './auth';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AuthModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
