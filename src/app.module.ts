import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './account-v1/account.controller';
import { AccountService } from './account-v1/account.service';
import { LeagueController } from './league-v4/league.controller';
import { LeagueService } from './league-v4/league.service';
import { MatchesController } from './match-v5/matches.controller';
import { MatchesService } from './match-v5/matches.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [MatchesController, LeagueController, AccountController],
  providers: [MatchesService, LeagueService, AccountService],
})
export class AppModule {}
