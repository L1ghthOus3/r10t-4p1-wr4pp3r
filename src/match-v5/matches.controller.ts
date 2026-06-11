import { Controller, Get, Param, Query } from "@nestjs/common";
import { GetMatchIdsQueryDto } from "./dto/get-match-ids-query.dto";
import { RegionQueryDto } from "../common/dto/region-query.dto";
import { MatchesService } from "./matches.service";

@Controller('match-v5')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}

    @Get('matches/by-puuid/:puuid')
    getMatchIds(
        @Param('puuid') puuid: string,
        @Query() query: GetMatchIdsQueryDto,
    ) {
        return this.matchesService.getMatchIds(puuid, query.region, query.start, query.count);
    }

    @Get('matches/:id')
    getMatch(
        @Param('id') id: string,
        @Query() query: RegionQueryDto,
    ) {
        return this.matchesService.getMatch(id, query.region);
    }
}
