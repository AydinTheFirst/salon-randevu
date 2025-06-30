import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth';
import { BusinessManagersModule } from './business-managers/business-managers.module';
import { BusinessesModule } from './businesses/businesses.module';
import { PaymentsModule } from './payments/payments.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServicesModule } from './services/services.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users';

const Modules = {
  AppointmentsModule,
  AuthModule,
  BusinessesModule,
  BusinessManagersModule,
  PaymentsModule,
  ProfilesModule,
  ServicesModule,
  TokenModule,
  UsersModule,
};

export default Object.values(Modules);
