import { AccountModule } from './account/account.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth';
import { BusinessesModule } from './businesses/businesses.module';
import { ManagersModule } from './managers/managers.module';
import { PaymentsModule } from './payments/payments.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServicesModule } from './services/services.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AccountModule,
  AppointmentsModule,
  AuthModule,
  BusinessesModule,
  ManagersModule,
  PaymentsModule,
  ProfilesModule,
  ServicesModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
