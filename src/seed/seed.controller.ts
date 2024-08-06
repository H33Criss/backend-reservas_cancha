import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';


@Controller('seed')
// @Auth(ValidRoles.admin, ValidRoles.superUser)
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get('/')
  // @Auth(ValidRoles.admin, ValidRoles.superUser)
  executeSeed() {
    if (process.env.STAGE === 'prod') return;
    return this.seedService.runSeed();
  }
}
