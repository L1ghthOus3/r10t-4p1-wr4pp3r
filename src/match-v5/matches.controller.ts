import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GetMatchIdsQueryDto } from './dto/get-match-ids-query.dto';
import { RegionQueryDto } from '../common/dto/region-query.dto';
import { MatchesService } from './matches.service';

@Controller('match-v5')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('matches/count-by-queueId/:id')
  async getMatchesCountByQueueId(@Param('id', ParseIntPipe) id: number) {
    return await this.matchesService.getNumberOfMatchesByType(id);
  }

  @Get('matches/most-played-game-modes')
  async getMostPlayedGameModes() {
    return await this.matchesService.getMostPlayedGameModes();
  }

  @Get('matches/by-puuid/:puuid')
  async getMatchIds(
    @Param('puuid') puuid: string,
    @Query() query: GetMatchIdsQueryDto,
  ) {
    return await this.matchesService.getMatchIds(
      puuid,
      query.region,
      query.start,
      query.count,
    );
  }

  @Get('matches/:id')
  async getMatch(@Param('id') id: string, @Query() query: RegionQueryDto) {
    return await this.matchesService.getMatch(id, query.region);
  }

  @Post('matches/by-puuid/:puuid/cache')
  async cacheMatchData(
    @Param('puuid') puuid: string,
    @Query() query: RegionQueryDto,
  ) {
    return await this.matchesService.updateMatchData(puuid, query.region);
  }
}
