import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './account-v1/account.controller';
import { AccountService } from './account-v1/account.service';
import { LeagueController } from './league-v4/league.controller';
import { LeagueService } from './league-v4/league.service';
import { MatchesController } from './match-v5/matches.controller';
import { MatchesService } from './match-v5/matches.service';
import { LolChallengesController } from './lol-challenges-v1/lol-challenges.controller';
import { LolChallengesService } from './lol-challenges-v1/lol-challenges.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    MatchesController,
    LeagueController,
    AccountController,
    LolChallengesController,
  ],
  providers: [
    MatchesService,
    LeagueService,
    AccountService,
    LolChallengesService,
  ],
})
export class AppModule {}
