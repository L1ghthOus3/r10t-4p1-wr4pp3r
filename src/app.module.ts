import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountController } from './account-v1/account.controller';
import { AccountService } from './account-v1/account.service';
import { LeagueController } from './league-v4/league.controller';
import { LeagueService } from './league-v4/league.service';
import { MatchesController } from './match-v5/matches.controller';
import { MatchesService } from './match-v5/matches.service';
import { LolChallengesController } from './lol-challenges-v1/lol-challenges.controller';
import { LolChallengesService } from './lol-challenges-v1/lol-challenges.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { Match } from './match-v5/entities/match.entity';
import { MatchSyncProgressStore } from './match-v5/match-sync-progress.store';
import { MatchSyncScheduler } from './match-v5/match-sync.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'sumsca'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Match]),
  ],
  controllers: [
    MatchesController,
    LeagueController,
    AccountController,
    LolChallengesController,
    ItemsController,
  ],
  providers: [
    MatchesService,
    MatchSyncProgressStore,
    MatchSyncScheduler,
    LeagueService,
    AccountService,
    LolChallengesService,
    ItemsService,
  ],
})
export class AppModule {}
