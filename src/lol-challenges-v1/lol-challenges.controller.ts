import { Controller, Get, Param, Query } from '@nestjs/common';
import { LolChallengesService } from './lol-challenges.service';
import { RegionQueryDto } from 'src/common/dto/region-query.dto';

@Controller('lol-challenges-v1')
export class LolChallengesController {
  constructor(private readonly lolChallengesService: LolChallengesService) {}

  @Get('player-data/:puuid')
  getPlayerChallenges(
    @Param('puuid') puuid: string,
    @Query() query: RegionQueryDto,
  ) {
    return this.lolChallengesService.getPlayerChallenges(puuid, query.region);
  }
}
